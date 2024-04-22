import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./models/searchSchema.js";
import {
	findProductsOnAmazon,
	findProductsOnFlipkart,
	findProductsOnAlibaba,
	findProductsOnSnapdeal,
} from "./scrapers/index.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);
const corsOptions = {
	origin: "*",
	methods: ["GET", "POST"],
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI);

app.get("/", (req, res) => {
	res.send("Hello, World! MongoDB connected successfully!");
});

app.post("/products", async (req, res) => {
	const { search_term, filter, topN, comparisonWebsites } = req.body;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;

	if (!search_term) {
		res.status(400).send("Please provide a search term");
		return;
	}

	try {
		// Define a filter object based on the provided filter parameter
		const filterObject = {};
		if (filter) {
			filterObject.fieldToFilter = filter; // Replace 'fieldToFilter' with the actual field you want to filter
		}

		// Search for existing products in the database based on the search term and filter
		const existingProducts = await Product.find({ search_term, ...filterObject })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean();

		if (existingProducts.length > 0) {
			// If there are existing products, return them
			res.send({ products: existingProducts });
			return;
		} else {
			// If no existing products, perform scraping and store in the database
			const products = await Promise.all([
				findProductsOnAmazon(search_term),
				findProductsOnFlipkart(search_term),
				findProductsOnSnapdeal(search_term),
				findProductsOnAlibaba(search_term),
			]);

			// Insert the scraped products into the database with website information
			const websites = ["amazon", "flipkart", "snapdeal", "alibaba"];

			const db_promises = [];

			for (let i = 0; i < products.length; i++) {
				const productsWithWebsite = products[i].map((product) => ({
					...product,
					website: websites[i],
					search_term,
					reviews: product.reviews || 0,
				}));

				db_promises.push(Product.insertMany(productsWithWebsite));
			}

			const insertedProducts = await Promise.all(db_promises);

			// Combine the results from different websites into a single array
			const allProducts = insertedProducts.flat();

			// Apply topN filter if specified
			if (topN) {
				allProducts.sort((a, b) => b.reviews - a.reviews); // Sort by reviews in descending order
				allProducts.splice(topN); // Keep only the top N products
			}

			// Apply comparisonWebsites filter if specified
			if (comparisonWebsites) {
				const filteredProducts = allProducts.filter((product) =>
					comparisonWebsites.includes(product.website)
				);
				res.send({ products: filteredProducts });
			} else {
				res.send({ products: allProducts });
			}
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("Internal Server Error");
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
import express, { Request, Response } from "express";
import authMiddleware from "@/middleware/authMiddleware";
import jwt from "jsonwebtoken";

// Models
import { initSearchIntent, getSearchHistory } from "@/models/searchSchema";
import { addSearchtoHistory, RegularUser } from "@/models/userSchema";
import { findProductsById } from "@/models/productSchema";

// Interfaces
import { User } from "@/interfaces/User";

// Jobs
import { scheduleSearchJob } from "@/jobs/searchQueue";

const searchsRouter = express.Router();

searchsRouter.post("/", authMiddleware, async (req: Request, res: Response) => {
  let searchIntentCreated: boolean|null  = null;
  const { searchTerm, country, filter, topN, comparisonWebsites } = req.body;
  const token = req.header("auth-token");

  const userId = jwt.decode(token);

  const search: any = await initSearchIntent(searchTerm);

  searchIntentCreated = await addSearchtoHistory(userId._id, search._id);

  // add search to the queue
  scheduleSearchJob(search._id, searchTerm);

  if (!searchIntentCreated) {
    return res.status(400).send({ error: "Search intent could not be created" });
  }
  res.send(search);

});


searchsRouter.get("/history", async (req: Request, res: Response) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(400).send({ error: "No token provided" });
  }

  const userId = jwt.decode(token)._id;

  if (!userId) {
    return res.status(400).send({ error: "Invalid token" });
  }

  const user: User | null = await RegularUser.findOne({ _id: userId });

  if (!user) {
    return res.status(400).send({ error: "User not found" });
  }
  const searchs = await getSearchHistory(user?.searchHistory);
  res.send(searchs);
});


/*
 * Search for a product in the database
 * 
 * POST /product
 * Request body:
 *  {
 *    "searchTerm": ""
 *  }
 * 
 * Response:
 *  {
 *    "searchResults": []
 *  }
 * 
 */
searchsRouter.get("/product", async (req: Request, res: Response) => {
  const { searchTerm } = req.query;

  if (typeof searchTerm !== 'string') {
    return res.status(400).send({ error: "Invalid search term" });
  }

  if (!searchTerm) {
    return res.status(400).send({ error: "Search term is required" });
  }

  const products = await findProductsById(searchTerm);

  console.log("products", products);

  if (!products) {
    return res.send({ error: "No products found" });
  }
  res.send(products);
}); 

export default searchsRouter;
import * as cheerio from "cheerio";
import fetch from "node-fetch";

// Interfaces
import { Product } from "@/interfaces/Product";

export const findProductsOnAmazon = async (searchTerm: string, country: string) => {
  // add some headers to make this seem legit
  const response = await fetch(
    `https://www.amazon.in/s?k=${searchTerm}&ref=nb_sb_noss_2`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36",
      },
    }
  );
  const content = await response.text();

  const $ = cheerio.load(content);
  const products: Product[] = [];
  $(".s-result-item").each((index, element) => {
    const product: Product = {
      title: $(element).find("h2").text().trim(),
      price: $(element).find(".a-price span").text().split("₹")[1],
      currency: '',
      image: $(element).find("img").attr("src"),
      link: `https://www.amazon.in${$(element).find("a").attr("href")}`,
      reviews: $(element)
        .find(".a-size-small")
        .text()
        .trim()
        .split(" ")
        .slice(-1)[0],
      rating: $(element).find(".a-icon-alt").text(),
      categories: [],
      websites: ["Amazon"],
    };

    if (product.title && product.price && product.image && product.link) {
      if (typeof product.price === 'string') {
        product.price = parseFloat(product.price.replace(/,/g, ""));
      }
    
      if (product.reviews && typeof product.reviews === 'string') {
        product.reviews = parseInt(product.reviews.replace(/,/g, ""));
      }

      products.push(product);
    }
  });

  return products;
};

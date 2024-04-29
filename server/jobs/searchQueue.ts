import Agenda from 'agenda';
import { MongoClient } from 'mongodb';

// Models
import { updateStatus, Search } from '@/models/searchSchema';
import { Product } from '@/models/productSchema';

// Scrapers
import { findProductsOnAmazon } from '@/scrapers/amazon-scraper';


const DB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB__CACHE_DBNAME ?? 'cache';

console.log("DB_URI", DB_URI);
console.log("DB_NAME", DB_NAME);

const client = await MongoClient.connect(`${DB_URI}/${DB_NAME}`);
const db = client.db(DB_NAME);

const agenda = new Agenda({ mongo: db });

// Define your job processing function
agenda.define('performSearch', async (job) => {
  const searchId = job.attrs.data.searchId;
  const searchTerm = job.attrs.data.searchTerm;

  console.log(`Performing search for ${searchTerm}`);
  // Simulate search operation
  await findProductsOnAmazon(searchTerm, 'IN')
    .then(async (products) => {
      console.log(`Found ${products.length} products for ${searchTerm}`);
      // Save products to database
      const res = await Product.insertMany(products);
      const productIds = res.map(obj => obj._id.toString(
        
      ));
      console.log("productIds", productIds);
      Search.updateOne({ _id: searchId }, { products: productIds });
    })
    .finally(async () => {
      // updateStatus(searchId, 'completed');
      setTimeout(() => {
        updateStatus(searchId, 'completed');
        console.log(`Finished search for ${searchTerm}`);

      }, 15000);
    });

  // await new Promise<void>(resolve => setTimeout(() => {
  //   updateStatus(searchId, 'completed');
  //   resolve();
  // }, 15000));
  // console.log(`Finished search for ${searchTerm}`);
});

// Start Agenda
await agenda.start();
console.log('Agenda started');

// Function to schedule a search job
export const scheduleSearchJob = async (searchId, searchTerm) => {
  await agenda.schedule('now', 'performSearch', { searchId, searchTerm });
};

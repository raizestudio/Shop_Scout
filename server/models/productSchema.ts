import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, index: true },
  price: Number,
  currency: String,
  image: String,
  link: String,
  reviews: Number,
  rating: String,
  categories: [String],
  websites: [String],
});

export async function findProducts(search_term: string, filterObject: object, page: number, limit: number) {
  const products = await Product.find({ search_term, ...filterObject })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return products;
};

export async function findProductById(productId: string) {
  const product = await Product.findOne({ _id: productId }).lean();
  return product;
};

export async function findProductByTitle(title: string) {
  const product = await Product.findOne({ title: title }).lean();
  return product;
};

export async function findProductsById(searchTerm: string) {
  const regEx = new RegExp(searchTerm, 'i');
  const products = await Product.find({ title: regEx }).lean();
  return products;
};

export async function createProduct(productObject: object) {
  const product = await Product.create(productObject);
  return product;
};


const Product = mongoose.model('Product', productSchema);

export { Product };

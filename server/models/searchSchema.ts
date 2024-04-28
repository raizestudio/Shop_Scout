import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  searchTerm: { type: String, index: true },
  products: [String],
  isSearching: { type: Boolean, default: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export async function initSearchIntent(searchTerm: string) {
  console.log('Search intent initialized');
  const search = Search.create({
    searchTerm,
  });

  return search;
};

export async function getSearchHistory(searchsIds: [string]) {
  console.log('Search history retrieved');
  // const searchs = Search.find({ userId });
  const searchs: Array<typeof Search> = [];
  let search;

  for (const searchId of searchsIds) {
    search = await Search.findOne({ _id: searchId }).exec();
    searchs.push(search);
  }

  return searchs;
};

export const updateStatus = async (searchId: string, status: string) => {
  try {
    const search: any = await Search.findOne({ _id: searchId });
    search.status = status;
    search.updatedAt = Date.now();
    await search.save();
    return search;
  } catch (error) {
    return null;
  }
}
const Search = mongoose.model('Search', searchSchema);

export { Search };

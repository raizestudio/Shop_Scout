import { ProductInterface } from "./productInterface";

export interface SearchInterface {
  _id: string;
  searchTerm: string;
  products: ProductInterface[];
  isSearching: boolean;
  createdAt: string;
  updatedAt: string;
}

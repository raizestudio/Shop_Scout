export interface Product {
  title: string;
  price: number | string;
  currency: string;
  image: string | undefined;
  link: string;
  reviews: number | string;
  rating: string;
  categories: string[];
  websites: string[];
}
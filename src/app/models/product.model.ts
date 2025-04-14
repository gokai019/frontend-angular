export interface Product {
  id: number;
  description: string;
  cost: string;
  prices: ProductPrice[];
}

export interface ProductPrice {
  id: number;
  salePrice: string;
  store: Store;
}

export interface Store {
  id: number;
  description: string;
}
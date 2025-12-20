export interface IProduct {
  id: number;
  name: string;
  price: number | null;
  discount: IDiscount | null;
  discount_price: null;
  rating: number | null;
  orders_count: number | null;
  comments_count: number | null;
  in_stock: number | null;
  is_best_seller: boolean;
  is_favorite: boolean;
  is_new: boolean;
  is_notify_me: boolean;
  is_show_stock: boolean;
  is_trend: boolean;
  expected_arrival: string | null;
  images: IProductImage[];
  modifications: IProductModification;
  brand: IBrand;
  article: string;
  characters: IProductCharacter[];
  about: string;
  combination: IProductCombination | null;
  similar_products: IProduct[];
  attributes: IProductAttribute[];
}

export interface IProductAttribute {
  id: number;
  key: { id: number; name: string; type: number };
  value: { id: number; name: string };
  image: string | null;
}

export interface IProductCombination {
  price: number;
  discount_price: number;
  discount: number;
  product: IProductCombinationProduct;
  product2: IProductCombinationProduct;
}

export interface IProductCombinationProduct {
  id: number;
  price: number;
  name: string;
  image: string;
  comments_count: number;
  rating: number;
}

export interface IProductCharacter {
  id: number;
  key: string;
  value: string;
}

export interface IDiscount {
  discount: number;
  for_add_to_cart: boolean;
}

export interface IBrand {
  id: number;
  name: string;
  image: string;
}

export interface IProductImage {
  id: number;
  image: string;
}

export interface IProductModification {
  id: number;
  price: number | null;
  discount: null;
  discount_price: null;
}

export interface ISearchProduct {
  id: number;
  type: string;
  name: string;
}

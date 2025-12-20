import type { IProduct, ISearchProduct } from './home.types';

import { API, type ApiResponse } from '@/shared/api';

export const getPopularProductsList = async () => {
  const response = await API.get<IProduct[]>('/product/popular-products/');
  return response.data;
};

export const getTrendProductsList = async () => {
  const response = await API.get<ApiResponse<IProduct[]>>(
    '/product/trend-products/'
  );
  return response.data;
};

export const getNewProductsList = async () => {
  const response = await API.get<IProduct[]>('/product/new-products/');
  return response.data;
};

export const getBestSellerProductsList = async () => {
  const response = await API.get<ApiResponse<IProduct[]>>(
    '/product/best-seller-products/'
  );
  return response.data;
};

export const getRecommendedProductsList = async () => {
  const response = await API.get<ApiResponse<IProduct[]>>(
    '/product/recommended-products/'
  );
  return response.data;
};

export const getSeenProductsList = async () => {
  const response = await API.get<IProduct[]>(
    '/product/seen-products/'
  );
  return response.data;
};

export const getSearchProducts = async (query: string) => {
  const response = await API.get<ISearchProduct[]>(
    `/product/search/?search=${query.trim()}`
  );
  return response.data;
};

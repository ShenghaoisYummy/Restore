import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:5001/api" }),
  endpoints: (builder) => ({
    fetchProducts: builder.query<Product[], void>({
      query: () => ({ url: "products" }),
    }),
    fetchProduct: builder.query<Product, number>({
      query: (productId) => ({ url: `products/${productId}` }),
    }),
  }),
});

export const { useFetchProductsQuery, useFetchProductQuery } = catalogApi;

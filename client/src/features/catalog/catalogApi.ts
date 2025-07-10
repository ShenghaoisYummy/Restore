import { createApi } from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/API/baseApi";
import { ProductParams } from "../../app/models/productParams";
import { filterEmptyValues } from "../../lib/util";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    fetchProducts: builder.query<Product[], ProductParams>({
      query: (productParams) => {
        return {
          url: "products",
          params: filterEmptyValues(productParams),
        };
      },
    }),
    fetchProductDetails: builder.query<Product, number>({
      query: (productId) => ({ url: `products/${productId}` }),
    }),
    fetchFilters: builder.query<{ brands: string[]; types: string[] }, void>({
      query: () => ({ url: "products/filters" }),
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductDetailsQuery,
  useFetchFiltersQuery,
} = catalogApi;

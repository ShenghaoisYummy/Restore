import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/API/baseApi";
import { CreateOrder, Order } from "../../app/models/order";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    fetchOrders: builder.query<Order[], void>({
      query: () => "orders",
      providesTags: ["Orders"],
    }),
    fetchOrderDetailed: builder.query<Order, number>({
      query: (id) => `orders/${id}`,
    }),
    createOrder: builder.mutation<Order, CreateOrder>({
      query: (order) => ({
        url: "orders",
        method: "POST",
        body: order,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(orderApi.util.invalidateTags(["Orders"]));
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useFetchOrdersQuery,
  useFetchOrderDetailedQuery,
  useCreateOrderMutation,
} = orderApi;

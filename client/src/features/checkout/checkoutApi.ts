import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/API/baseApi";
import { Basket } from "../../app/models/basket";
import { basketApi } from "../basket/basketApi";

// create a checkout api to create a payment intent
// use redux RTK Query to create a payment intent
// this is a separate API slice that updates the basket state with payment intent data
export const checkoutApi = createApi({
  // Redux store slice name
  reducerPath: "checkoutApi",

  // baseQuery (BaseQueryApi) with error handling
  baseQuery: baseQueryWithErrorHandling,

  // define the endpoints for the checkout api
  endpoints: (builder) => ({
    // builder is an object that provides methods to create endpoints for the checkout api
    //<Basket, void> is the return type of the query, basket is the type of the data returned by the query
    // void is the type of the argument passed to the query
    createPaymentIntent: builder.mutation<Basket, void>({
      query: () => {
        return {
          url: "payments",
          method: "POST",
        };
      },

      // queryFulfilled is a Promise that resolves when the query completes successfully
      // _ is the argument passed to the query
      // dispatch is the dispatch function from the redux store
      // queryFulfilled is a function that is called when the query is fulfilled

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          // data is the data returned by the query
          const { data } = await queryFulfilled;

          // once the query is completed, which means the backend has created the payment intent
          // in database, we need to update the basket cache with the client secret, for frontend to use it
          // update the basket cache with the client secret
          dispatch(
            basketApi.util.updateQueryData(
              "fetchBasket",
              undefined,
              (draft) => {
                draft.clientSecret = data.clientSecret;
              }
            )
          );
          console.log(data);
        } catch (error) {
          console.log("Payment intent creation failed");
        }
      },
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = checkoutApi;

import { baseQueryWithErrorHandling } from "../../app/API/baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Basket, Item } from "../../app/models/basket";
import { Product } from "../../app/models/product";
import Cookies from "js-cookie";

// type guard to check if the product is a BasketItem
function isBasketItem(product: Product | Item): product is Item {
  return (product as Item).productId !== undefined;
}

export const basketApi = createApi({
  reducerPath: "basketApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Basket"],
  endpoints: (builder) => ({
    fetchBasket: builder.query<Basket, void>({
      query: () => "basket",
      providesTags: ["Basket"],
    }),
    addBasketItem: builder.mutation<
      Basket,
      { product: Product | Item; quantity: number }
    >({
      query: ({ product, quantity }) => {
        const productId = isBasketItem(product)
          ? product.productId
          : product.id;
        return {
          url: `basket?productId=${productId}&quantity=${quantity}`,
          method: "POST",
        };
      },
      onQueryStarted: async (
        { product, quantity },
        { dispatch, queryFulfilled }
      ) => {
        let isNewBasket = false;
        const patchResult = dispatch(
          basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
            const productId = isBasketItem(product)
              ? product.productId
              : product.id;
            if (!draft?.items || draft.items.length === 0) {
              isNewBasket = true;
            }
            if (!isNewBasket) {
              const existingItem = draft.items.find(
                (item) => item.productId === productId
              );
              if (existingItem) {
                existingItem.quantity += quantity;
              } else {
                draft.items.push(
                  isBasketItem(product)
                    ? product
                    : { ...product, productId: product.id, quantity }
                );
              }
            }
          })
        );
        try {
          await queryFulfilled;
          if (isNewBasket) {
            dispatch(basketApi.util.invalidateTags(["Basket"]));
          }
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      },
    }),
    removeBasketItem: builder.mutation<
      void,
      { productId: number; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `basket?productId=${productId}&quantity=${quantity}`,
        method: "DELETE",
      }),
      onQueryStarted: async (
        { productId, quantity },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
            const existingItem = draft.items.find(
              (item) => item.productId === productId
            );
            if (existingItem) {
              existingItem.quantity -= quantity;
              if (existingItem.quantity <= 0) {
                draft.items = draft.items.filter(
                  (item) => item.productId !== productId
                );
              }
            }
          })
        );
        try {
          await queryFulfilled;
          dispatch(basketApi.util.invalidateTags(["Basket"]));
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      },
    }),
    /**
     * This mutation is only used to client-side clear the redux basket cache
     * without making a request to the server.
     * We use queryFn to return undefined to avoid making a request to the server.
     */
    clearBasket: builder.mutation<void, void>({
      queryFn: () => ({ data: undefined }),
      onQueryStarted: async (_, { dispatch }) => {
        const patchResult = dispatch(
          basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
            draft.items = [];
          })
        );
        Cookies.remove("basketId");
      },
    }),
  }),
});

export const {
  useFetchBasketQuery,
  useAddBasketItemMutation,
  useRemoveBasketItemMutation,
  useClearBasketMutation,
} = basketApi;

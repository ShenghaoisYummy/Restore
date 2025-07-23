import { counterSlice } from "../../features/contact/counterReducer";
import { configureStore } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { catalogApi } from "../../features/catalog/catalogApi";
import { uiSlice } from "../layout/uiSlice";
import { errorApi } from "../../features/about/errorApi";
import { basketApi } from "../../features/basket/basketApi";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { accountApi } from "../../features/account/accountApi";
export const store = configureStore({
  reducer: {
    [catalogApi.reducerPath]: catalogApi.reducer,
    [errorApi.reducerPath]: errorApi.reducer,
    counter: counterSlice.reducer,
    ui: uiSlice.reducer,
    [basketApi.reducerPath]: basketApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    catalog: catalogSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      catalogApi.middleware,
      errorApi.middleware,
      basketApi.middleware,
      accountApi.middleware
    ),
});

// Define the RootState type as the return type of store.getState()
// This infers the shape of the entire Redux state tree
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch type as the type of store.dispatch
export type AppDispatch = typeof store.dispatch;

// Create typed versions of the Redux hooks for dispatch and selector
// This enables type safety and autocompletion in components

// Typed useDispatch hook
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Typed useSelector hook
export const useAppSelector = useSelector.withTypes<RootState>();

import {
  BaseQueryApi,
  fetchBaseQuery,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { startLoading, stopLoading } from "../layout/uiSlice";
export const baseUrl = "https://localhost:5001/api";

const customBaseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
});

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  //start loading
  api.dispatch(startLoading());

  await sleep();

  const result = await customBaseQuery(args, api, extraOptions);
  // stop loading
  api.dispatch(stopLoading());

  if (result.error) {
    const { status, data } = result.error;
    console.log({ status, data });
  }

  return result;
};

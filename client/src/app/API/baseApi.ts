import {
  BaseQueryApi,
  fetchBaseQuery,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";

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
  await sleep();
  const result = await customBaseQuery(args, api, extraOptions);
  // stop loading
  if (result.error) {
    const { status, data } = result.error;
    console.log({ status, data });
  }
  return result;
};

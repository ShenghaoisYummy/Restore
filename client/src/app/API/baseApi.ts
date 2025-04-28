import {
  BaseQueryApi,
  fetchBaseQuery,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";

const baseUrl = "https://localhost:5001/api";

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
    const originalStatus =
      result.error.status === "PARSING_ERROR"
        ? result.error.originalStatus
        : result.error.status;

    const errorData = result.error.data;
    console.log(errorData);

    switch (originalStatus) {
      case 400:
        toast.error(errorData as string);
        break;
      case 401:
        toast.error(errorData as string);
        break;
      case 404:
        toast.error(errorData as string);
        break;
      case 500:
        toast.error(errorData as string);
        break;
      default:
        break;
    }
  }

  return result;
};

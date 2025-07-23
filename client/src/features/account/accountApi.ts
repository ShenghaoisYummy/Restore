import { baseQueryWithErrorHandling } from "../../app/API/baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "../../app/models/user";

// create the accountApi
export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    login: builder.mutation<void, object>({
      query: (creds) => {
        return {
          url: "login?useCookies=true",
          method: "POST",
          body: creds,
        };
      },
    }),
    register: builder.mutation<void, object>({
      query: (creds) => {
        return {
          url: "account/register",
          method: "POST",
          body: creds,
        };
      },
    }),
    userInfo: builder.query<User, void>({
      query: () => {
        return {
          url: "account/userInfo",
        };
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => {
        return {
          url: "account/logout",
          method: "POST",
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserInfoQuery,
  useLogoutMutation,
} = accountApi;

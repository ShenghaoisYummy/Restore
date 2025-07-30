import { baseQueryWithErrorHandling } from "../../app/API/baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "../../app/models/user";
import { LoginSchema } from "../../lib/schemas/loginSchema";
import { toast } from "react-toastify";
import { router } from "../../app/routes/Routes";

// create the accountApi
export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["UserInfo"],
  endpoints: (builder) => ({
    login: builder.mutation<void, LoginSchema>({
      query: (creds) => {
        return {
          url: "login?useCookies=true",
          method: "POST",
          body: creds,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(accountApi.util.invalidateTags(["UserInfo"]));
        } catch (error) {
          console.log(error);
        }
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
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          // queryFulfilled is a promise that resolves when the query is fulfilled
          // await queryFulfilled is used to wait for the query to be fulfilled
          // toast.success is used to show a success message
          // router.navigate is used to navigate to the login page
          await queryFulfilled;
          toast.success("Registration successful");
          router.navigate("/login");
        } catch (error) {
          console.log(error);
        }
      },
    }),
    userInfo: builder.query<User, void>({
      query: () => {
        return {
          url: "account/userInfo",
        };
      },
      providesTags: ["UserInfo"],
    }),
    logout: builder.mutation<void, void>({
      query: () => {
        return {
          url: "account/logout",
          method: "POST",
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(accountApi.util.invalidateTags(["UserInfo"]));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserInfoQuery,
  useLogoutMutation,
  useLazyUserInfoQuery,
} = accountApi;

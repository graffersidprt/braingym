import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginInput } from "../../pages/LoginPage";
import {
  BASE_URL,
  USER_LOGIN,
  FORGOT_PASSWORD,
  VERIFY_FORGOT_PASSWORD_EMAIL,
  CHANGE_PASSWORD,
  LOGOUT_USER,
} from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      {
        access_token: string;
        status: string;
        success: boolean;
        message: string;
        data: any;
      },
      LoginInput
    >({
      query(data) {
        return {
          url: USER_LOGIN,
          method: "POST",
          body: data,
          headers: getApiHeader(),
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {}
      },
    }),
    forgotPassword: builder.mutation<{ data: any }, null>({
      query(data) {
        return {
          url: FORGOT_PASSWORD,
          method: "POST",
          body: data,
          headers: getApiHeader(),
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {}
      },
    }),
    verifyEmail: builder.mutation<{ data: any }, null>({
      query(data) {
        return {
          url: VERIFY_FORGOT_PASSWORD_EMAIL,
          method: "POST",
          body: data,
          headers: getApiHeader(),
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {}
      },
    }),
    changePassword: builder.mutation<{ data: any }, null>({
      query(data) {
        return {
          url: CHANGE_PASSWORD,
          method: "POST",
          body: data,
          headers: getApiHeader(),
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {}
      },
    }),
    logoutUser: builder.mutation<{ data: any }, null>({
      query(data) {
        return {
          url: LOGOUT_USER,
          method: "POST",
          body: data,
          headers: getApiHeader(),
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useChangePasswordMutation,
  useLogoutUserMutation,
} = authApi;

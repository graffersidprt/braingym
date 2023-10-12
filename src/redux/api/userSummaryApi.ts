import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, USERS_SUMMARY } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const userSummaryApi = createApi({
  reducerPath: "userSummaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getUserSummary: builder.mutation({
      query() {
        return {
          url: USERS_SUMMARY,
          method: "GET",
          headers: getApiHeader(),
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(data);
        } catch (error) {}
      },
    }),
  }),
});

export const { useGetUserSummaryMutation } = userSummaryApi;

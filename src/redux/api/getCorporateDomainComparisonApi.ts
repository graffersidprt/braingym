import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_CORMPORATE_DOMAINS_COMPARISON } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const getCorporateDomainComparisonApi = createApi({
  reducerPath: "getCorporateDomainComparisonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getCorporateDomainComparison: builder.mutation({
      query(request) {
        return {
          url: GET_CORMPORATE_DOMAINS_COMPARISON,
          method: "POST",
          headers: getApiHeader(),
          body: request
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

export const { useGetCorporateDomainComparisonMutation } = getCorporateDomainComparisonApi;

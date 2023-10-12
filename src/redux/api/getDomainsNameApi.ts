import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_DOMAINS_NAME } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const getDomainsNameApi = createApi({
  reducerPath: "getDomainsNameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getDomainsName: builder.mutation<{ data: any }, any>({
      query(isChiledDomain) {
        return {
          url: GET_DOMAINS_NAME,
          method: "GET",
          headers: getApiHeader(),
          params: { isChiledDomain },
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

export const { useGetDomainsNameMutation } = getDomainsNameApi;

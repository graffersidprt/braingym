import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, ORG_DETAILS } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const orgDetailsApi = createApi({
  reducerPath: "orgDetailsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getOrganizationDetails: builder.mutation<{ data: any }, void>({
      query: () => {
        return {
          url: ORG_DETAILS,
          method: "GET",
          headers: getApiHeader(),
        };
      },
    }),
  }),
});
/* For this use as prefix and Mutation as suffix */
export const { useGetOrganizationDetailsMutation } = orgDetailsApi;

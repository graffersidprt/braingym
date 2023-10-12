import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_MOST_SHARED_RESURCES } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const getMostSharedResourcesApi = createApi({
  reducerPath: "getMostSharedResourcesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getMostSharedResources: builder.mutation({
      query(request) {
        return {
          url: GET_MOST_SHARED_RESURCES,
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

export const { useGetMostSharedResourcesMutation } = getMostSharedResourcesApi;

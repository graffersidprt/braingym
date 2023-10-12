import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_MOST_ADDED_EVENT } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const getMostAddedEventApi = createApi({
  reducerPath: "getMostAddedEventApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getMostAddedEvent: builder.mutation({
      query(request) {
        return {
          url: GET_MOST_ADDED_EVENT,
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

export const { useGetMostAddedEventMutation } = getMostAddedEventApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_MESSAGES_CALLS } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const messagesCallsApi = createApi({
  reducerPath: "messagesCallsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getMessagesCalls: builder.mutation<{ data: any }, any>({
      query() {
        return {
          url: GET_MESSAGES_CALLS,
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

export const { useGetMessagesCallsMutation } = messagesCallsApi;

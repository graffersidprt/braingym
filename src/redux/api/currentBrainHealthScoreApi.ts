import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_BRAIN_HEALTH_SCORE } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const currentBrainHealthScoreApi = createApi({
  reducerPath: "currentBrainHealthScoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getCurrentBrainHealthScore: builder.mutation({
      query(request) {
        return {
          url: GET_BRAIN_HEALTH_SCORE,
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

export const { useGetCurrentBrainHealthScoreMutation } = currentBrainHealthScoreApi;

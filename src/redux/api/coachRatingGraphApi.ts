import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_COACH_RATING } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const coachRatingGraphApi = createApi({
  reducerPath: "coachRatingGraphApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getCoachRatingGraph: builder.mutation({
      query(request) {
        return {
          url: GET_COACH_RATING,
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

export const { useGetCoachRatingGraphMutation } = coachRatingGraphApi;

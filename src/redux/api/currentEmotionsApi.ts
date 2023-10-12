import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_CURRENT_EMOTIONS } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const currentEmotionsApi = createApi({
  reducerPath: "currentEmotionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getCurrentEmotions: builder.mutation<{ data: any }, any>({
      query(params) {
        return {
          url: GET_CURRENT_EMOTIONS,
          method: "POST",
          headers: getApiHeader(),
          body: params
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

export const { useGetCurrentEmotionsMutation } = currentEmotionsApi;

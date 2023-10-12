import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_EMOTIONAL_STATE } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const emotionalStateApi = createApi({
  reducerPath: "emotionalStateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getEmotionalState: builder.mutation<{ data: any }, any>({
      query(params) {
        return {
          url: GET_EMOTIONAL_STATE,
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

export const { useGetEmotionalStateMutation } = emotionalStateApi;

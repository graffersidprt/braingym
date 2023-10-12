import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_BRAIN_HEALTH } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";
import { ISummaryRequestPayload } from "./types";

export const brainHealthProgressApi = createApi({
  reducerPath: "brainHealthProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getBrainHealthProgress: builder.mutation<
      { data: any },
      ISummaryRequestPayload
    >({
      query(request) {
        return {
          url: GET_BRAIN_HEALTH,
          method: "POST",
          body: request,
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

export const { useGetBrainHealthProgressMutation } = brainHealthProgressApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, COACH_DETAILS } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const coachApi = createApi({
  reducerPath: "coachApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getCoachProfile: builder.mutation<{ data: any }, void>({
      query: () => {
        return {
          url: COACH_DETAILS,
          method: "GET",
          headers: getApiHeader(),
        };
      },
    }),
  }),
});
export const { useGetCoachProfileMutation } = coachApi;

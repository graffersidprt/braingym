import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GET_WIDGET_POSITION, UPDATE_WIDGET_POSITION} from "../../constants/server";
import { getApiHeader } from "../../constants/utils";
export const widgetApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  endpoints: (builder) => ({
    getWidgetPosition: builder.mutation<{ data: any }, any>({
        query() {
          return {
            url: GET_WIDGET_POSITION,
            method: "POST",
            headers: getApiHeader(),
          };
        }
      }),
    updateWidgetPosition: builder.mutation<{ data: any }, any>({
      query(data) {
        return {
          url: UPDATE_WIDGET_POSITION,
          method: "POST",
          params: data,
          headers: getApiHeader(),
        };
      }
    }),
  }),
});

export const { useGetWidgetPositionMutation, useUpdateWidgetPositionMutation } = widgetApi;
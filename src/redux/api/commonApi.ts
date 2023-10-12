import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BASE_URL,
  CITY_LIST,
  COUNTRY_LIST,
  DEPARTMENT_LIST,
  EMPLOYEE_GENDER_LIST,
  LANGUAGE_LIST,
  PRONOUNS_LIST,
  STATE_LIST,
} from "../../constants/server";
import { getApiHeader } from "../../constants/utils";

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getGenderList: builder.mutation<{ data: any }, void>({
      query: () => {
        return {
          url: EMPLOYEE_GENDER_LIST,
          method: "GET",
          headers: getApiHeader(),
        };
      },
    }),
    getCountryList: builder.mutation<{ data: any }, void>({
      query: () => {
        return {
          url: COUNTRY_LIST,
          method: "GET",
          headers: getApiHeader(),
        };
      },
    }),
    getLanguageList: builder.mutation<{ data: any }, void>({
      query: () => {
        return {
          url: LANGUAGE_LIST,
          method: "GET",
          headers: getApiHeader(),
        };
      },
    }),
    getStateList: builder.mutation<{ data: any }, void>({
      query: (id) => {
        return {
          url: STATE_LIST,
          method: "GET",
          params: { countryId: id },
          headers: getApiHeader(),
        };
      },
    }),
    getCityList: builder.mutation<{ data: any }, void>({
      query: (id) => {
        return {
          url: CITY_LIST,
          method: "GET",
          params: { stateId: id },
          headers: getApiHeader(),
        };
      },
    }),
    getPronounsList: builder.mutation<{ data: any }, void>({
      query: (id) => {
        return {
          url: PRONOUNS_LIST,
          method: "GET",
          params: { stateId: id },
          headers: getApiHeader(),
        };
      },
    }),
    getDepartmentList: builder.mutation<{ data: any }, void>({
      query: () => {
        return {
          url: DEPARTMENT_LIST,
          method: "GET",
          headers: getApiHeader(),
        };
      },
    }),
  }),
});
export const {
  useGetGenderListMutation,
  useGetCountryListMutation,
  useGetLanguageListMutation,
  useGetStateListMutation,
  useGetCityListMutation,
  useGetPronounsListMutation,
  useGetDepartmentListMutation
} = commonApi;

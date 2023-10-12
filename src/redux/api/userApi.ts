import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "../features/userSlice";
import { BASE_URL, EDIT_CORPORATE_DETAILS, UPLOAD_IMAGE, USER_DETAILS } from "../../constants/server";
import { getApiHeader } from "../../constants/utils";
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  endpoints: (builder) => ({
    getUser: builder.mutation<{ data: any }, null>({
      query(id) {
        return {
          url: USER_DETAILS,
          method: "GET",
          params: { id: id },
          headers: getApiHeader(),
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {}
      },
    }),
    updateUserDetails: builder.mutation<{ data: any }, any>({
      query(data) {
        return {
          url: EDIT_CORPORATE_DETAILS,
          method: "POST",
          body: data,
          headers: getApiHeader(),
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {}
      },
    }),
    uploadImage: builder.mutation<{
      success: { data: any; } | undefined; data: any 
}, any>({
      query(data) {
        return {
          url: UPLOAD_IMAGE,
          method: "POST",
          body: data,
          headers: getApiHeader(),
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {}
      },
    }),
  }),
});

export const { useGetUserMutation, useUpdateUserDetailsMutation, useUploadImageMutation } = userApi;

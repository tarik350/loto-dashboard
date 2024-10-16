import { AdminUser } from "@/utils/dto/adminUserDto";
import { GenericResponse } from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {},
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      GenericResponse<AdminUser>,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "admin/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

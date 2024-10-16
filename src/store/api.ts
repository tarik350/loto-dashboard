import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.append("Authorization", "Bearer " + Cookies.get("token"));
    },
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<void, void>({
      query: () => ({ method: "GET", url: "" }),
    }),
  }),
  tagTypes: ["permissions", "categories"],
});

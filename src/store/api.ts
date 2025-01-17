import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { setSessionExpired } from "./features/sessionSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.append("Authorization", "Bearer " + Cookies.get("token"));
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 403) {
    api.dispatch(setSessionExpired("expired"));
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUsers: builder.query<void, void>({
      query: () => ({ method: "GET", url: "" }),
    }),
  }),
  tagTypes: [
    "permissions",
    "categories",
    "roles",
    "adminuser",
    "gamecategories",
    "games",
    "game",
    "users",
  ],
});

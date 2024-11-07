import { GenericResponse } from "@/utils/types";
import { api } from "../api";
import { PaginationDto } from "@/utils/dto/paginationDto";
import { UserDto } from "@/utils/dto/userDto";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      GenericResponse<PaginationDto<UserDto[]>>,
      {
        page: number;
        sortBy?: "id" | "balance" | "created_at";
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "admin/users",
        method: "GET",
        params,
      }),
      providesTags: ["users"],
    }),
    searchUser: builder.mutation<
      GenericResponse<PaginationDto<UserDto[]>> | GenericResponse<UserDto[]>,
      { query: string; query_by?: string; paginate: boolean }
    >({
      query: (params) => ({
        url: "admin/search/user",
        method: "GET",
        params,
      }),
    }),
  }),
});

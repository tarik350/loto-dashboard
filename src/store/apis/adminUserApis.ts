import { AdminUserDto, AdminUserRequestDto } from "@/utils/dto/adminUserDto";
import { api } from "../api";
import { GenericResponse } from "@/utils/types";
import { PaginationDto, PaginationRequestDto } from "@/utils/dto/paginationDto";
import { RoleDto } from "@/utils/dto/roleDto";

export const adminUserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createAdminUser: builder.mutation<
      GenericResponse<AdminUserDto>,
      AdminUserRequestDto
    >({
      query: (body) => ({
        url: "admin/admin-user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["adminuser"],
    }),
    getAdminUser: builder.query<
      GenericResponse<PaginationDto<(AdminUserDto & { role?: RoleDto })[]>>,
      PaginationRequestDto
    >({
      query: (params) => ({
        url: "admin/admin-user",
        method: "GET",
        params,
      }),
      providesTags: ["adminuser"],
    }),
    searchAdminUser: builder.mutation<
      GenericResponse<PaginationDto<AdminUserDto[]>>,
      { query: string; query_by?: string }
    >({
      query: (params) => ({
        url: "admin/search/user",
        method: "GET",
        params,
      }),
    }),
    deleteAdminUser: builder.mutation<GenericResponse<void>, { ids: number[] }>(
      {
        query: (body) => ({
          url: "admin/admin-user",
          method: "DELETE",
          body,
        }),
        invalidatesTags: ["adminuser"],
      }
    ),
  }),
});

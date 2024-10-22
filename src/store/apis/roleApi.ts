import { GenericResponse } from "@/utils/types";
import { api } from "../api";
import { RoleDto } from "@/utils/dto/roleDto";
import { PaginationDto, PaginationRequestDto } from "@/utils/dto/paginationDto";

export const roleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRole: builder.mutation<
      GenericResponse<RoleDto>,
      { name: string; permissions: number[] }
    >({
      query: (body) => ({
        url: "admin/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["roles"],
    }),
    getAllRoles: builder.query<
      GenericResponse<PaginationDto<RoleDto[]>>,
      PaginationRequestDto
    >({
      query: (params) => ({
        url: "admin/roles",
        method: "GET",
        params,
      }),
      providesTags: ["roles"],
    }),

    deleteRole: builder.mutation<GenericResponse<void>, { roles: number[] }>({
      query: (body) => ({
        url: "admin/roles",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["roles"],
    }),
    searchRole: builder.mutation<
      GenericResponse<PaginationDto<RoleDto[]>>,
      { query: string; query_by?: string }
    >({
      query: (params) => ({
        url: "admin/search/roles",
        method: "GET",
        params,
      }),
    }),
  }),
});

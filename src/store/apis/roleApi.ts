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
  }),
});

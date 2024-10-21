import {
  CategoryDto,
  PermissionDto,
  PermissionRequestDto,
} from "@/utils/dto/permissionDto";
import { GenericResponse } from "@/utils/types";
import { api } from "./api";
import { PaginationDto, PaginationRequestDto } from "@/utils/dto/paginationDto";

export const permissionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<
      GenericResponse<PaginationDto<PermissionDto[]>>,
      PaginationRequestDto & { category_id?: number }
    >({
      query: (params) => ({
        url: `admin/permissions`,
        method: "GET",
        params,
      }),
      providesTags: ["permissions"],
    }),
    getPermissionsWithCategory: builder.query<
      GenericResponse<
        PaginationDto<(CategoryDto & { permissions?: PermissionDto[] })[]>
      >,
      // PaginationRequestDto & { category_id?: number }
      void
    >({
      query: () => ({
        url: `admin/categories/permissions`,
        method: "GET",
      }),
      providesTags: ["permissions"],
    }),

    createPermission: builder.mutation<
      GenericResponse<PermissionDto>,
      PermissionRequestDto
    >({
      query: ({ categoryId, name, description }) => ({
        url: "admin/permissions",
        method: "POST",
        body: { name, description, category_id: categoryId },
      }),
      invalidatesTags: ["permissions"],
    }),
    deletePermission: builder.mutation<
      GenericResponse<PermissionDto>,
      { ids: number | number[] }
    >({
      query: ({ ids }) => {
        const url = Array.isArray(ids)
          ? "admin/permissions"
          : `admin/permissions/${ids}`;
        const body = Array.isArray(ids) ? { ids } : null;
        return {
          url,
          method: "DELETE",
          body,
        };
      },
      invalidatesTags: ["permissions"],
    }),
    getPermissionCategories: builder.query<
      GenericResponse<CategoryDto[]>,
      void
    >({
      query: () => ({
        url: "admin/categories",
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
    searchPermissions: builder.mutation<
      GenericResponse<PaginationDto<PermissionDto[]>>,
      { query: string }
    >({
      query: (params) => ({
        url: "admin/search/permissions",
        method: "GET",
        params,
      }),
    }),
  }),
});

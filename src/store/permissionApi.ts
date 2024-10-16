import {
  CategoryDto,
  PermissionDto,
  PermissionRequestDto,
} from "@/utils/dto/permissionDto";
import { GenericResponse } from "@/utils/types";
import { api } from "./api";

export const permissionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<GenericResponse<PermissionDto[]>, void>({
      query: () => ({
        url: "admin/permissions",
        method: "GET",
      }),
      providesTags: ["permissions"],
    }),
    createPermission: builder.mutation<
      GenericResponse<PermissionDto>,
      PermissionRequestDto
    >({
      query: (body) => ({
        url: "admin/permissions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["permissions"],
    }),
    deletePermission: builder.mutation<
      GenericResponse<PermissionDto>,
      { ids: number | number[] }
    >({
      query: (body) => ({
        url: "admin/permissions",
        method: "DELETE",
        body,
      }),
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
  }),
});

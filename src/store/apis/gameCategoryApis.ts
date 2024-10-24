import {
  GameCategoryDto,
  GameCategoryRequestDto,
} from "@/utils/dto/createGameCategoryDto";
import { api } from "../api";
import { GenericResponse } from "@/utils/types";
import { PaginationDto } from "@/utils/dto/paginationDto";

export const gameCategoryApis = api.injectEndpoints({
  endpoints: (builder) => ({
    createGameCategory: builder.mutation<
      GenericResponse<GameCategoryDto>,
      GameCategoryRequestDto
    >({
      query: (body) => ({
        url: "admin/game-category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["gamecategories"],
    }),
    getGameCategories: builder.query<
      GenericResponse<PaginationDto<GameCategoryDto[]>>,
      { page: number }
    >({
      query: (params) => ({
        url: "admin/game-category",
        method: "GET",
        params,
      }),
      providesTags: ["gamecategories"],
    }),
    deleteGameCategories: builder.mutation<
      GenericResponse<void>,
      { categories: number[] }
    >({
      query: (body) => ({
        url: "admin/game-category",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["gamecategories"],
    }),
    searchGameCategories: builder.mutation<
      GenericResponse<PaginationDto<GameCategoryDto[]>>,
      { query: string; query_by?: string }
    >({
      query: ({ query, query_by = "searchable_id, title_en , title_am" }) => ({
        url: "admin/search/game-category",
        method: "GET",
        params: { query, query_by },
      }),
    }),
  }),
});

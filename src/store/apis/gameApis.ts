import { GenericResponse } from "@/utils/types";
import { api } from "../api";
import { PaginationDto } from "@/utils/dto/paginationDto";
import { GameDto } from "@/utils/dto/gameDto";
import { GameCategoryDto } from "@/utils/dto/createGameCategoryDto";

export const gameApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createGame: builder.mutation<
      GenericResponse<GameDto>,
      { categoryId: number }
    >({
      query: (body) => ({
        url: "admin/games",
        method: "POST",
        body,
      }),
      invalidatesTags: ["games"],
    }),
    getGameWithCategory: builder.query<
      GenericResponse<(GameCategoryDto & { games: GameDto[] })[]>,
      void
    >({
      query: () => ({
        url: "admin/games",
        method: "GET",
      }),
      providesTags: ["games"],
    }),
  }),
});

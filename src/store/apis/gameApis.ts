import { GenericResponse } from "@/utils/types";
import { api } from "../api";
import { PaginationDto } from "@/utils/dto/paginationDto";
import { GameDto, TicketDto } from "@/utils/dto/gameDto";
import {
  GameCategoryDto,
  GameCategoryRequestDto,
} from "@/utils/dto/createGameCategoryDto";
import { query } from "firebase/firestore";
import { gameTicketStatus } from "@/utils/constants";

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
    getAllGamesWithCategory: builder.query<
      GenericResponse<
        (GameCategoryDto & { games: GameDto[]; games_count: number })[]
      >,
      void
    >({
      query: () => ({
        url: "admin/games",
        method: "GET",
      }),
      providesTags: ["games"],
    }),
    getAllGamesForParticularCategory: builder.query<
      GenericResponse<{
        category: GameCategoryDto;
        games: PaginationDto<GameDto[]>;
      }>,
      { categoryId: string; page: number; gameStatus?: string }
    >({
      query: (params) => ({
        url: "admin/games/category",
        method: "GET",
        params,
      }),
      providesTags: ["games"],
    }),

    getGame: builder.query<
      GenericResponse<
        GameDto & { category: GameCategoryDto; tickets: TicketDto[] }
      >,
      { gameId: string }
    >({
      query: (params) => ({
        url: `admin/games/${params.gameId}`,
        method: "GET",
      }),
    }),
    searchGame: builder.mutation<
      GenericResponse<PaginationDto<GameDto[]>>,
      { query: string; categoryId: number; query_by?: string }
    >({
      query: (params) => ({
        url: "admin/search/games",
        method: "GET",
        params,
      }),
    }),
    searchGameTicket: builder.mutation<
      GenericResponse<TicketDto[]>,
      {
        query?: string;
        gameId: number;
        query_by?: string;
        ticketStatus?: gameTicketStatus;
      }
    >({
      query: (params) => ({
        url: "admin/search/game/ticket",
        method: "GET",
        params,
      }),
    }),
  }),
});

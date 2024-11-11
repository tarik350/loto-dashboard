import { GenericResponse } from "@/utils/types";
import { api } from "../api";
import { PaginationDto } from "@/utils/dto/paginationDto";
import { GameAnalyticsDto, GameDto, TicketDto } from "@/utils/dto/gameDto";
import {
  GameCategoryDto,
  GameCategoryRequestDto,
} from "@/utils/dto/createGameCategoryDto";
import { gameTicketStatus } from "@/utils/constants";
import { UserDto } from "@/utils/dto/userDto";
import { CategoryDto } from "@/utils/dto/permissionDto";

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
      {
        categoryId: string;
        page: number;
        gameStatus?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "admin/games/category",
        method: "GET",
        params,
      }),
      providesTags: ["games"],
    }),

    getGame: builder.query<
      GenericResponse<{
        game: GameDto & {
          category: GameCategoryDto;
          tickets: (TicketDto & {
            owner: Pick<
              UserDto,
              "phone" | "full_name" | "id" | "profile_picture"
            >;
          })[];
        };
        analytic: GameAnalyticsDto;
        users: Pick<
          UserDto,
          "phone" | "full_name" | "id" | "profile_picture"
        >[];
      }>,
      { gameId: string }
    >({
      query: (params) => ({
        url: `admin/games/${params.gameId}`,
        method: "GET",
      }),
      providesTags: ["game"],
    }),
    getCompletedGames: builder.query<
      GenericResponse<
        PaginationDto<(GameDto & { category: GameCategoryDto })[]>
      >,
      { category?: string; page: number }
    >({
      query: (params) => ({
        url: "admin/games/completed",
        method: "GET",
        params,
      }),
      providesTags: ["games"],
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
    getUserTicketsInGame: builder.mutation<
      GenericResponse<{
        ticket_count: number;
        locked_count: number;
        sold_count: number;
        tickets: TicketDto[];
      }>,
      { userId: number; gameId: number }
    >({
      query: (params) => ({
        url: "admin/game/user/tickets",
        method: "GET",
        params,
      }),
    }),
    getTicketOwnerInGame: builder.mutation<
      GenericResponse<
        Pick<UserDto, "full_name" | "phone" | "profile_picture" | "id">[]
      >,
      { ticketNumber: number; gameId: number }
    >({
      query: (params) => ({
        url: "admin/game/ticket/owner",
        method: "GET",
        params,
      }),
    }),
    searchUserInGame: builder.mutation<
      GenericResponse<UserDto[]>,
      { query: string; gameId: number; query_by?: string }
    >({
      query: (params) => ({
        url: "admin/game/search/owner",
        method: "GET",
        params,
      }),
    }),
    searchCompletedGames: builder.mutation<
      GenericResponse<
        PaginationDto<(GameDto & { category: GameCategoryDto })[]>
      >,
      { query: string; query_by?: string }
    >({
      query: (params) => ({
        url: "admin/search/games/completed",
        method: "GET",
        params,
      }),
    }),
  }),
});

import { GenericResponse } from "@/utils/types";
import { api } from "../api";
import { METHODS } from "http";
import { GameDto, TicketDto } from "@/utils/dto/gameDto";
import { GameCategoryDto } from "@/utils/dto/createGameCategoryDto";
import { UserDto } from "@/utils/dto/userDto";
import { WinningTicketDto } from "@/utils/dto/winningTicketDto";

export const winningTicketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    setWinningTicket: builder.mutation<
      GenericResponse<{ gameId: number }>,
      {
        gameId: number;
        first: number;
        second: number;
        third: number;
        video_url: string;
      }
    >({
      query: (body) => ({
        url: "admin/winning-tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["game"],
    }),
    getWinningTicketsForGame: builder.query<
      GenericResponse<{
        game: GameDto & { category: GameCategoryDto };
        tickets: WinningTicketDto[];
      }>,
      { category?: string; gameId: number }
    >({
      query: ({ category, gameId }) => ({
        url: `admin/winning-tickets/${gameId}`,
        method: "GET",
        params: { category },
      }),
    }),
    reportGame: builder.mutation<
      GenericResponse<{ game: GameDto }>,
      { gameId: number }
    >({
      query: ({ gameId }) => ({
        url: `admin/winnig-tickets/audit/report/${gameId}`,
        method: "POST",
      }),
    }),
    markGameAudited: builder.mutation<
      GenericResponse<{ game: GameDto }>,
      { gameId: number }
    >({
      query: ({ gameId }) => ({
        url: `admin/winning-tickets/audit/${gameId}/`,
        method: "POST",
      }),
    }),
  }),
});

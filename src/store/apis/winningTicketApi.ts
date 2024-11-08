import { GenericResponse } from "@/utils/types";
import { api } from "../api";

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
        url: "admin/winning-numbers",
        method: "POST",
        body,
      }),
    }),
  }),
});

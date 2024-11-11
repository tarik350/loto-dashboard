import { TicketDto } from "./gameDto";
import { UserDto } from "./userDto";

export interface WinningTicketDto {
  id: number;
  created_at: string;
  updated_at: string;
  game_id: number;
  ticket_id: number;
  place: "first" | "second" | "third";
  ticket: TicketDto & { owner: UserDto };
}

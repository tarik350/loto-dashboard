import { gameStatus, ticketNumberStatus } from "../constants";

interface GameDto {
  gameCategoryId: string;
}
export interface GameRequestDto extends GameDto {
  id: string;
  gameStatus: gameStatus;
}

export interface GameResponseDto extends GameDto {
  ticketNumbers: TicketNumberDto[];
  numberOfTicketSold: number;
  gameStatus: string;
}

export interface TicketNumberDto {
  id: number;
  value: number;
  status: ticketNumberStatus;
}

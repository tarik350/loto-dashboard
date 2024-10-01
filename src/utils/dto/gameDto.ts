import { ticketNumberStatus } from "../constants";

export interface GameRequestDto {
  gameCategoryId: string;
  ticketNumbers: TikcetNumberDto[];
  numberOfTicketSold: number;
}

interface TikcetNumberDto {
  value: number;
  stauts: ticketNumberStatus;
}

import { gameStatus } from "../constants";

export interface GameDto {
  id: number;
  created_at: string;
  updated_at: string;
  status: gameStatus;
  category_id: number;
  first_place_winner_id: null;
  second_place_winner_id: null;
  third_place_winner_id: null;
  name: string;
  sold_ticket_count: number;
  winning_video_url?: string;
}

export interface TicketDto {
  id: number;
  game_id: number;
  ticket_number: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GameAnalyticsDto {
  total_tickets: number;
  tickets_sold: number;
  tickets_locked: number;
  unique_users: number;
}

export enum GameStatusEnum {
  ALL_TICKETS_SOLD = "all-tickets-sold",
  ALL_TICKETS_LOCKED = "all-tickets-locked",
  FINISHED = "finished",
  ONGOING = "on-going",
  AUDITED = "audited",
}

import { Extensions } from "firebase-admin/extensions";

export interface GameCategoryRequestDto {
  title_en: string;
  title_am: string;
  game_duration: string;
  winning_prize: number;
  second_winning_prize: number;
  third_winning_prize: number;
  ticket_count: number;
  ticket_price: number;
}

export interface GameCategoryDto {
  title_en: string;
  title_am: string;
  game_duration: string;
  winning_prize: number;
  second_winning_prize: number;
  third_winning_prize: number;
  ticket_count: number;
  ticket_price: number;
  updated_at: string;
  created_at: string;
  id: number;
}

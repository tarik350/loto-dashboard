interface CreateGameCategoryDto {
  title: {
    en: string;
    am: string;
  };
  duration: "hourly" | "daily" | "weekly" | "monthly";
  winningPrize: number;
  secondPlacePrize: number;
  thirdPlacePrize: number;
  ticketPrice: number;
  numberOfTicket: number;
  createdAt: string;
  updatedAt: string;
}
export interface CreateGameCategoryRequestDto extends CreateGameCategoryDto {}
export interface CreateGameCategoryResponseDto extends CreateGameCategoryDto {
  id: string;
}

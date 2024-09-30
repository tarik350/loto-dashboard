export interface CreateGameCategoryRequestDto {
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
}

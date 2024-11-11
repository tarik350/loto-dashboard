import React from "react";
import { GameAnalyticsDto, GameDto } from "../dto/gameDto";
import { GameCategoryDto } from "../dto/createGameCategoryDto";

interface GameCategory {
  title_en: string;
  title_am: string;
  ticket_count: number;
}

interface Game {
  id: string;
  name: string;
  category: GameCategory;
  status: string;
}

interface Analytics {
  tickets_locked: number;
  tickets_sold: number;
  total_tickets: number;
  unique_users: number;
}

interface GameDetailsProps {
  game: GameDto & { category: GameCategoryDto };
  analytics?: GameAnalyticsDto;
}

export default function GameDetails({ game, analytics }: GameDetailsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6 border-2 border-purple border-opacity-15">
      <div className="text-xl font-semibold text-gray-700">
        Game ID: <span className="font-bold text-indigo-600">{game.id}</span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Game Name:</span>
          <span className="font-bold text-gray-900">{game.name}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Game Category:</span>
          <span className="font-bold text-gray-900">
            {game.category.title_en} (
            <span className="italic text-gray-600">
              {game.category.title_am}
            </span>
            )
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Game Total Ticket:</span>
          <span className="font-bold text-gray-900">
            {game.category.ticket_count}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Game Status:</span>
          <span className="font-bold text-gray-900 uppercase">
            {game.status.split("-").join(" ")}
          </span>
        </div>
      </div>

      {analytics && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Locked Tickets:</span>
            <span className="font-bold text-gray-900">
              {analytics.tickets_locked}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Sold Tickets:</span>
            <span className="font-bold text-gray-900">
              {analytics.tickets_sold}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Remaining Ticket:</span>
            <span className="font-bold text-gray-900">
              {analytics.total_tickets - analytics.tickets_sold}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Users Who Bought Tickets:</span>
            <span className="font-bold text-gray-900">
              {analytics.unique_users}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

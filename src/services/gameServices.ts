import { GenericResponse } from "@/utils/types";

export async function createGame(data: {
  gameCategoryId: string;
}): Promise<GenericResponse<{ gameId: string }>> {
  try {
    const response = await fetch("/api/game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create game category");
    }
    return result;
  } catch (error) {
    throw error;
  }
}

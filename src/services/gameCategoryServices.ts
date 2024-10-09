// api/gameCategoryApi.ts

import * as api from "@/utils/apiServiceHelper";
import {
  CreateGameCategoryRequestDto,
  CreateGameCategoryResponseDto,
} from "@/utils/dto/createGameCategoryDto";
import { GenericResponse } from "@/utils/types";

export async function createGameCategory(
  data: CreateGameCategoryRequestDto
): Promise<GenericResponse<{ id: number }>> {
  try {
    const response = await api.authenticatedPost({
      url: "/api/gamecategories",
      method: "POST",
      body: data,
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

export async function getGameCategory(): Promise<
  GenericResponse<CreateGameCategoryResponseDto[]>
> {
  try {
    const response = await api.authenticatedGet({ url: "/api/gamecategories" });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create game category");
    }
    return result;
  } catch (error) {
    throw error;
  }
}
export async function deleteGameCategory({
  id,
}: {
  id: string;
}): Promise<GenericResponse<{ id: string }>> {
  try {
    // Pass the id in the URL
    const response = await api.authenticatedPost({
      url: "/api/gamecategories",
      method: "DELETE",
      body: { id },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to delete game category");
    }
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

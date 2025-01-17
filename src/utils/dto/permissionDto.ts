// import { PermissionCategoryDto } from "./settingDto";

import { PaginationRequestDto } from "./paginationDto";

// export interface PermissionDto {
//   name: string;
//   category: PermissionCategoryDto;
//   description: string;
//   id: string;
//   createdAt: string;
//   updatedAt: string;
// }

export interface PermissionRequestDto {
  categoryId: number;
  description: string;
  name: string;
}

export interface PermissionDto {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  categories: CategoryDto;
  description?: string;
}

export interface CategoryDto {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

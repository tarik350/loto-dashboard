export interface SortDto<T extends string = string> {
  sortOrder?: "asc" | "desc";
  sortBy?: T;
}

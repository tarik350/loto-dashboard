export interface PaginationDto<T> {
  current_page: number;
  first_page_url: string;
  data: T;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface PaginationRequestDto {
  page: number;
}

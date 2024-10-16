export interface AdminUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role_id: number;
  is_email_verified: number;
  is_suspended: number;
  token: string;
  refresh_token: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

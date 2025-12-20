export interface IUser {
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
  image: string | null;
  gender: number;
  birth_date: Date | string | null;
  access_token: string;
  refresh_token: string;
}

export interface ICheckPhoneResponse {
  is_registered: boolean;
  msg: string;
  success: boolean;
}

export interface IVerifyPhoneResponse {
  success: boolean;
  msg: string;
}

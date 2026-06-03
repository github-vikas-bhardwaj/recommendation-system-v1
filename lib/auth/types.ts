export type CurrentUser = {
  id: number;
  name: string;
  email: string;
};

export type SessionRecord = {
  user_id: number;
  expires_at: string;
};

export type SessionInsert = {
  token_hash: string;
  user_id: number;
  expires_at: string;
};

export type SessionCookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
};

export type FlashCookieOptions = {
  maxAge: number;
  httpOnly: boolean;
  path: string;
  sameSite: "lax";
  secure: boolean;
};

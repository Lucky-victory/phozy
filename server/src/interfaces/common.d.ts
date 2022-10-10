import { USER_RESULT } from "./Users";
import { ALBUM_RESULT } from "./Albums";

export interface Config {
  db_host: string;
  db_pass: string;
  db_user: string;
  jwt_secret_key: string;
  jwt_expiration?: string;
  cloudinary_url: string;
}

declare global {
  declare namespace Express {
    interface Request {
      auth: AuthUser;
      jwtToken: string;
      photo_url: string;
      photo_urls: string[];
      album: ALBUM_RESULT;
      user: USER_RESULT;
    }
  }
}

export interface AuthUser {
  user: USER_RESULT;
}

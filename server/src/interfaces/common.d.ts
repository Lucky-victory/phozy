import { USER_RESULT } from "./Users";
import { ALBUM_RESULT } from "./Albums";
import { PHOTO_FROM_CLIENT } from "./Photos";
import formidable from "formidable";

export interface Config {
  db_host: string;
  db_pass: string;
  db_user: string;
  jwt_secret_key: string;
  jwt_expiration?: string;
  cloudinary_url: string;allowed_origin?:string
}

declare global {
  declare namespace Express {
    interface Request {
      auth: AuthUser;
      jwtToken: string;
      photos: PHOTO_FROM_CLIENT[];
      photo_url: string;
      photo_urls: any[];
      album: ALBUM_RESULT;
      user: USER_RESULT;
      files: formidable.File[];
      fields: any;
      captions: string[];
    }
  }
}

export interface AuthUser {
  user: USER_RESULT;
}

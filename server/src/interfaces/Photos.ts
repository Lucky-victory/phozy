import { USER_RESULT } from "./Users";

export interface IPhoto {
  id: string;
  url: string;
  user_id: number;
  caption?: string;
  album_id: string;
  likes: {
    count: number;
    users: USER_RESULT[];
  };
  views: number;
  created_at?: number;
  updated_at?: number;
}
export type NEW_PHOTO = Pick<
  IPhoto,
  "album_id" | "caption" | "url" | "user_id"
>;
export type PHOTO_RESULT = Omit<IPhoto, "updated_at">;

import { PHOTO_RESULT, } from "./photo.interface";

export interface IAlbum {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  is_public?: boolean;
  created_at: number;
  updated_at?: number;
  photos:PHOTO_RESULT[]
}
export type NEW_ALBUM = Pick<
  IAlbum,
  "description" | "title" | "is_public"
>;
export type ALBUM_RESULT = Omit<
  IAlbum,
 "updated_at"
>;

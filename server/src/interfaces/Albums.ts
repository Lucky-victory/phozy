import { PHOTO_RESULT } from "./Photos";

export interface IAlbum {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  is_public?: boolean;
  created_at: number;
  updated_at?: number;
  photos:string[]|PHOTO_RESULT[]
}
export type NEW_ALBUM = Pick<
  IAlbum,
  "description" | "title" | "is_public" | "user_id"
>;
export type ALBUM_RESULT = Omit<
  IAlbum,
  "updated_at"
>;

export interface IAlbum {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  is_public?: boolean;
  created_at: number;
  updated_at?: number;
}
export type NEW_ALBUM = Pick<
  IAlbum,
  "description" | "title" | "is_public" | "user_id"
>;
export type ALBUM_RESULT = Pick<
  IAlbum,
  "id" | "description" | "created_at" | "title" | "is_public" | "user_id"
>;

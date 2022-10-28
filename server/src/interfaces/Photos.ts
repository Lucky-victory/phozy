import { USER_RESULT } from "./Users";

export interface IPhoto {
  id: string;
  url: string;
  user_id: string;
  caption?: string;
  likes: { users: string[]; count: number };
  tags: string[] | { [key: string]: string }[];
  views?: number;
  created_at: number;
  updated_at?: number;
  is_liked?: boolean;
}
export type PHOTO_TO_VIEW = Pick<
  IPhoto,
  "caption" | "created_at" | "id" | "is_liked" | "likes" | "tags" | "url" | "views"
> & {
  user: USER_RESULT;
};
export type NEW_PHOTO = Pick<IPhoto, "caption" | "url" | "user_id" | "tags">;
export type PHOTO_RESULT = Omit<IPhoto, "updated_at">;
export type PHOTO_FROM_CLIENT = {
  image: string;
  caption: string;
  tags: string;
};

import { DateType } from "./common";

export interface ILikes {
  user_id: number;
  photo_id: number;
}

export interface ILikesResult extends ILikes {
  id: number;
  created_at?: DateType;
}

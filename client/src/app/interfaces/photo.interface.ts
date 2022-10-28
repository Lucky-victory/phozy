import { USER_RESULT } from './user.interface';

export interface IPhoto {
    id: string;
    url: string;
    user_id: string;
    caption?: string;
    likes: { users: string[]; count: number };
    tags: string[] ;
    views?: number;
    created_at: number;
    updated_at?: number;
    is_liked?: boolean;
}
export type PHOTO_RESULT = Omit<
    IPhoto,
    "updated_at"|"user_id"
  
>
export type PHOTO_TO_VIEW = Omit<
    IPhoto,
    "updated_at"|"user_id"
> & {
    user: USER_RESULT;
};

export type PHOTO_FROM_CLIENT = {
    id: string;
    image: string | File;
    caption?: string;
    tags?: string;
};

export type QUERY_RESPONSE<T=any> = {
    message: string,
    data:T
}
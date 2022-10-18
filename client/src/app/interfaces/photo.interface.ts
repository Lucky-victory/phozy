import { USER_RESULT } from './user.interface';

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
    liked?: boolean;
}
export type PHOTO_TO_VIEW = Pick<
    IPhoto,
    | 'caption'
    | 'created_at'
    | 'id'
    | 'liked'
    | 'likes'
    | 'tags'
    | 'url'
    | 'views'
> & {
    user: USER_RESULT;
};

export type PHOTO_FROM_CLIENT = {
    id: string;
    image: string | File;
    caption?: string;
    tags?: string;
};

export interface AUTH_TOKEN {
    token: string;
    expiresIn: number;
}
export type AUTH_USER = Pick<IUser, 'id' | 'fullname' | 'username'>;
export interface IAuth {
    user:USER_RESULT;
    auth: AUTH_TOKEN;
}

export interface IUser {
    id: string;
    fullname: string;
    profile_image?: string;
    profile_cover?: string;

    username: string;
    email: string;
    password?: string;
    socials?: { [key: string]: string };
    created_at?: string | number;
    updated_at?: string | number;
}

export type NEW_USER = Pick<
    IUser,
    'username' | 'email' | 'password' | 'fullname' | 'profile_image'
>;
export type USER_RESULT = Pick<
    IUser,
    'fullname' | 'id' | 'username' | 'socials' | 'profile_image'
>;

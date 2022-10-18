export interface IUser {
  id: string;
  fullname: string;
  profile_image?: string;
  profile_cover?: string;
  username: string;
  email: string;
  password?: string;
  socials: { [key: string]: string };
  created_at?: string | number;
  updated_at?: string | number;
}

export type NEW_USER = Pick<
  IUser,
  "username" | "email" | "password" | "fullname" | "profile_image"
>;
export type USER_RESULT = Pick<
  IUser,
  "fullname" | "id" | "username" | "socials"
>;
export type USER_AUTH = Pick<
  IUser,
  "password" | "id" | "fullname" | "username"|"profile_image"
>;

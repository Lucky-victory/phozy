export interface IUser {
  id: string;
  fullname: string;
  profile?: {
    image?: string;
    cover?: string;
  };
  username: string;
  email: string;
  password?: string;
  socials: { [key: string]: string };
  created_at?: string | number;
  updated_at?: string | number;
}
export interface IUserProfile {
  profile_image?: string;
}
export type NEW_USER = Pick<IUser, "email" | "password">;
export type USER_RESULT = Pick<
  IUser,
  "fullname" | "id" | "profile" | "username" | "socials"
>;

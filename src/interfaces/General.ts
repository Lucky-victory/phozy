export interface IGeneralResult {
  user: IGeneralUser;
  pid: number;
  album_id: number;
  url: string;
  liked?: boolean;
}

export interface IGeneralUser {
  uid: number;
  fullname: string;
  username: string;
  profile_image?: string;
}

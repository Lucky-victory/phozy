export type DateType = string | Date;
export interface IAlbumResult{
 title: string;
  description?: string;
  user_id: number;
  privacy?: boolean;
  id?: number;
  created_at?: DateType;
  updated_at?: DateType | null;
}

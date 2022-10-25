import { AlbumsState } from "./album/album.reducer";
import { UserState } from "./auth/auth.reducer";
import { PhotosState } from "./photo/photo.reducer";

export interface AppState{
    photos:PhotosState,
    albums: AlbumsState,
    user:UserState
}
export type STATE_STATUS = 'pending' | 'loading' | 'complete' | 'error';
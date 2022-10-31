import { AlbumsState } from './album/album.reducer';
import { UserState } from './auth/auth.reducer';
import { PhotosByUserState, PhotosState } from './photo/photo.reducer';

export interface AppState {
    photos: PhotosState;
    albums: AlbumsState;
    user: UserState;
    photosByUser: PhotosByUserState;
}
export type STATE_STATUS = 'pending' | 'complete' | 'error';

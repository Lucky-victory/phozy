import { AlbumsState } from './album/album.reducer';
import { UserState } from './auth/auth.reducer';
import { PhotosState } from './photo/photo.reducer';
import { PhotosByUserState } from './photos-by-user/photos-by-user.reducer';

export interface AppState {
    photos: PhotosState;
    albums: AlbumsState;
    user: UserState;
    photosByUser: PhotosByUserState;
    photoSearch;
}
export type STATE_STATUS = 'pending' | 'complete' | 'error' | 'loading';

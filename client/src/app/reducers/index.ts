import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { albumReducer } from '../state/album/album.reducer';
import { AppState } from '../state/app.state';
import { authReducer } from '../state/auth/auth.reducer';
import { photoSearchReducer } from '../state/photo-search/photo-search.reducer';
import { photoReducer } from '../state/photo/photo.reducer';
import { photosByUserReducer } from '../state/photos-by-user/photos-by-user.reducer';

export const reducers: ActionReducerMap<AppState> = {
    photos: photoReducer,
    albums: albumReducer,
    photosByUser: photosByUserReducer,
    user: authReducer,
    photoSearch: photoSearchReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
    ? []
    : [];

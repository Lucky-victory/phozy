import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { albumReducer } from '../state/album/album.reducer';
import { AppState } from '../state/app.state';
import { authReducer } from '../state/auth/auth.reducer';
import {
    photoReducer,
    photosByUserReducer,
} from '../state/photo/photo.reducer';

export const reducers: ActionReducerMap<AppState> = {
    photos: photoReducer,
    albums: albumReducer,
    photosByUser: photosByUserReducer,
    user: authReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
    ? []
    : [];

import { routerReducer } from '@ngrx/router-store';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { albumReducer } from '../state/album/album.reducer';
import { authReducer } from '../state/auth/auth.reducer';
import { photoReducer } from '../state/photo/photo.reducer';


export interface State {

}

export const reducers: ActionReducerMap<State> = {
photos:photoReducer,albums:albumReducer,router:routerReducer,auth:authReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

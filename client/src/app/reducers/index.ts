import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { albumReducer } from '../state/album/album.reducer';
import { photoReducer } from '../state/photo/photo.reducer';


export interface State {

}

export const reducers: ActionReducerMap<State> = {
photos:photoReducer,albums:albumReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

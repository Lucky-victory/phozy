import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { photoReducer } from '../state/photo/photo.reducer';


export interface State {

}

export const reducers: ActionReducerMap<State> = {
photos:photoReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

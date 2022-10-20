import { Action, createReducer, on } from '@ngrx/store';
import { PHOTO_TO_VIEW } from './interfaces/photo.interface';
import { collectPhoto, likePhoto } from './photo.actions';


export const photoFeatureKey = 'photo';

export interface State {

}

export const initialState: Partial<PHOTO_TO_VIEW> = {

};

export const photoReducer = createReducer(
  initialState,
  on(likePhoto, (state) => { state.is_liked = !state.is_liked;  return state}),
  on(collectPhoto, (state) => state)
);

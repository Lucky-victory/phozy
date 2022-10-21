import { createReducer, on } from '@ngrx/store';
import { PHOTO_TO_VIEW } from '../../interfaces/photo.interface';
import { collectPhoto, likePhoto, loadPhotos, photosLoadSuccess } from './photo.actions';


export const photoFeatureKey = 'photo';

export interface PhotosState{
photos:PHOTO_TO_VIEW[]
}

export const initialState:PhotosState = {
photos:[]
};

export const photoReducer = createReducer(
  initialState,on(loadPhotos,(state)=>({...state})),
  on(likePhoto, (state, {id },) => ({
    ...state, photos: state.photos.map((photo) => {
      if (photo.id === id) photo.is_liked = !photo.is_liked;
      return photo
    })
  })),
  on(unlikePhoto, (state, {id },) => ({
    ...state, photos: state.photos.map((photo) => {
      if (photo.id === id) photo.is_liked = !photo.is_liked;
      return photo
    })
  })),
  on(photosLoadSuccess,(state,{photos})=>({...state,photos:photos})),
  on(collectPhoto, (state) => state)
);

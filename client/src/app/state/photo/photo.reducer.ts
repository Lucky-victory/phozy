import { createReducer, on } from '@ngrx/store';
import { PHOTO_TO_VIEW } from '../../interfaces/photo.interface';
import { STATE_STATUS } from '../app.state';
import { likePhoto,unlikePhoto, loadPhotos, photosLoadSuccess, photoLikeOrUnlikeSuccess, } from './photo.actions';


export const photoFeatureKey = 'photo';

export interface PhotosState{
  photos: PHOTO_TO_VIEW[],
  status:STATE_STATUS
}

export const initialState:PhotosState = {
  photos: [],
  status:'pending'
};

export const photoReducer = createReducer(
  initialState,on(loadPhotos,(state)=>({...state})),
  on(likePhoto, (state, action) => ({
    ...state,
  })),
  on(unlikePhoto, (state, action) => ({
    ...state,
  })),
  on(photoLikeOrUnlikeSuccess, (state, { photo:updatedPhoto }) => ({
    ...state,status:'complete',
    photos: [...state.photos.map((photo) => {
      return (photo.id === updatedPhoto.id) ? updatedPhoto : photo;
    })]
  })),
 
  on(photosLoadSuccess,(state,{photos})=>({...state,photos:photos,status:'complete'})),
 
);

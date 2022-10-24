import { createReducer, on } from '@ngrx/store';
import { PHOTO_TO_VIEW } from '../../interfaces/photo.interface';
import { collectPhoto, likePhoto,unlikePhoto, loadPhotos, photosLoadSuccess, photoLikeOrUnlikeSuccess, collectPhotoSuccess } from './photo.actions';


export const photoFeatureKey = 'photo';

export interface PhotosState{
photos:PHOTO_TO_VIEW[]
}

export const initialState:PhotosState = {
photos:[]
};

export const photoReducer = createReducer(
  initialState,on(loadPhotos,(state)=>({...state})),
  on(likePhoto, (state, action) => ({
    ...state,
  })),
  on(unlikePhoto, (state, action) => ({
    ...state,
  })),
  on(photoLikeOrUnlikeSuccess, (state, { photo:newPhoto }) => ({
    ...state,
    photos: state.photos.map((photo) => {
      if (photo.id !== newPhoto.id) return photo;
      return newPhoto
    })
  })),
  on(collectPhoto,(state,action)=>({...state})),
  on(collectPhotoSuccess,(state,action)=>({...state})),
  on(photosLoadSuccess,(state,{photos})=>({...state,photos:photos})),
  on(collectPhoto, (state) => state)
);

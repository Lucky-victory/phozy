import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { PhotosByUserState, PhotosState } from './photo.reducer';

export const selectPhotos = (state: AppState) => state.photos;
export const selectUserPhotos = (state: AppState) => state.photosByUser;
export const selectAllPhotos = createSelector(
    selectPhotos,
    (state: PhotosState) => state.photos
);
export const selectPhotosByUser = createSelector(
    selectUserPhotos,
    (state: PhotosByUserState) => state.photos
);
export const selectPhotosByUserStatus = createSelector(
    selectUserPhotos,
    (state: PhotosByUserState) => state.status
);
export const selectPhotosByUserError = createSelector(
    selectUserPhotos,
    (state: PhotosByUserState) => state.error
);
export const selectOnePhoto = createSelector(
    selectPhotos,
    (state: PhotosState) => state.photo
);
export const selectPhotosStatus = createSelector(
    selectPhotos,
    (state: PhotosState) => state.status
);
export const selectPhotosState = createSelector(
    selectPhotos,
    (state: PhotosState) => state
);
export const selectPhotosError = createSelector(
    selectPhotos,
    (state: PhotosState) => state.error
);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { PhotosByUserState } from './photos-by-user.reducer';

export const selectUserPhotos = (state: AppState) => state.photosByUser;
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

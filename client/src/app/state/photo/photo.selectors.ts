import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { PhotosState } from './photo.reducer';

export const selectPhotos = (state: AppState) => state.photos;
export const selectAllPhotos = createSelector(
    selectPhotos,
    (state: PhotosState) => state.photos
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

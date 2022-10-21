import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { PhotosState } from './photo.reducer';

export const selectPhotos = (state: AppState) => state.photos;
export const selectAllPhotos = createSelector(
    selectPhotos,(state:PhotosState)=>state.photos
)
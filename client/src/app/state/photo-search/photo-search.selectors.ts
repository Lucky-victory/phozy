import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { photoSearchState } from './photo-search.reducer';

export const selectSearch = (state: AppState) => state.photoSearch;
export const selectPhotoSearch = createSelector(
    selectSearch,
    (state: photoSearchState) => state.photos
);
export const selectPhotoSearchStatus = createSelector(
    selectSearch,
    (state: photoSearchState) => state.status
);

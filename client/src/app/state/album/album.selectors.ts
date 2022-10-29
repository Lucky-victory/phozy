import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { AlbumsState } from './album.reducer';

export const selectAlbums = (state: AppState) => state.albums;

export const selectAllAlbums = createSelector(
    selectAlbums,
    (state: AlbumsState) => state.albums
);
export const selectAlbumsStatus = createSelector(
    selectAlbums,
    (state: AlbumsState) => state.status
);
export const selectAlbumsError = createSelector(
    selectAlbums,
    (state: AlbumsState) => state.error
);

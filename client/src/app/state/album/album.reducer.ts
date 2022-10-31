import { createReducer, on } from '@ngrx/store';
import { ALBUM_RESULT } from 'src/app/interfaces/album.interface';
import { AlbumService } from 'src/app/services/album/album.service';
import { STATE_STATUS } from '../app.state';
import {
    collectPhoto,
    collectPhotoFailure,
    collectPhotoSuccess,
    createAlbum,
    createAlbumFailure,
    createAlbumSuccess,
    loadAlbums,
    loadAlbumsFailure,
    loadAlbumsSuccess,
} from './album.actions';

export const albumFeatureKey = 'album';

export interface AlbumsState {
    albums: ALBUM_RESULT[];
    status: STATE_STATUS;
    error: string;
}

export const initialState: AlbumsState = {
    albums: [],
    status: 'pending',
    error: null,
};

export const albumReducer = createReducer(
    initialState,
    on(collectPhoto, (state, action) => ({
        ...state,

        error: null,
    })),
    on(collectPhotoSuccess, (state, { album }) => ({
        ...state,
        status: 'complete',
        albums: state.albums.map((_album) => {
            if (_album.id !== album.id) return _album;
            return album;
        }),
        error: null,
    })),
    on(collectPhotoFailure, (state, { error }) => ({
        ...state,
        status: 'error',
        error,
    })),
    on(loadAlbums, (state) => ({ ...state, status: 'pending', error: null })),
    on(loadAlbumsSuccess, (state, { albums }) => ({
        ...state,
        albums: albums,
        status: 'complete',
        error: null,
    })),
    on(loadAlbumsFailure, (state, { error }) => ({
        ...state,

        status: 'error',
        error,
    })),
    on(createAlbum, (state, { album }) => ({
        ...state,
        status: 'pending',
        error: null,
    })),
    on(createAlbumSuccess, (state, { album }) => ({
        ...state,
        albums: [...state.albums, album],
        status: 'complete',
        error: null,
    })),
    on(createAlbumFailure, (state, { error }) => ({
        ...state,

        status: 'error',
        error,
    }))
);

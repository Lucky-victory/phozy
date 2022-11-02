import { createReducer, on } from '@ngrx/store';
import { PHOTO_TO_VIEW } from '../../interfaces/photo.interface';
import { STATE_STATUS } from '../app.state';
import {
    likePhoto,
    unlikePhoto,
    loadPhotos,
    photosLoadSuccess,
    photoLikeOrUnlikeSuccess,
    loadPaginatedPhotos,
    loadPaginatedPhotosSuccess,
    loadOnePhoto,
    loadOnePhotoSuccess,
    photosLoadFailure,
    
} from './photo.actions';

export const photoFeatureKey = 'photo';

export interface PhotosState {
    photos: PHOTO_TO_VIEW[];
    status: STATE_STATUS;
    is_at_end: boolean;
    photo?: PHOTO_TO_VIEW;
    error: string;
}

export const initialState: PhotosState = {
    photos: [],
    status: 'pending',
    is_at_end: false,
    error: null,
};

export const photoReducer = createReducer(
    initialState,
    on(loadPhotos, (state) => ({ ...state, error: null })),
    on(likePhoto, (state, action) => ({
        ...state,

        error: null,
    })),
    on(loadOnePhoto, (state, action) => ({
        ...state,
        status: 'pending',
        error: null,
    })),
    on(loadOnePhotoSuccess, (state, { photo }) => ({
        ...state,
        photo: photo,
        photos: state.photos.reduce((accum, prevPhoto) => {
            photo.id !== prevPhoto.id ? accum.push(photo) : accum;
            return accum;
        }, []),
        status: 'complete',
        error: null,
    })),
    on(unlikePhoto, (state, action) => ({
        ...state,

        error: null,
    })),
    on(photoLikeOrUnlikeSuccess, (state, { photo: updatedPhoto }) => ({
        ...state,
        status: 'complete',
        error: null,
        photos: [
            ...state.photos.map((photo) => {
                return photo.id === updatedPhoto.id ? updatedPhoto : photo;
            }),
        ],
    })),

    on(loadPaginatedPhotos, (state) => ({ ...state })),
    on(loadPaginatedPhotosSuccess, (state, { photos }) => {
        return {
            ...state,
            photos: [...state.photos, ...photos],
            status: 'complete',
            is_at_end: !photos.length,
        };
    }),

    on(photosLoadSuccess, (state, { photos }) => ({
        ...state,
        photos: photos,
        status: 'complete',
    })),
    on(photosLoadFailure, (state, { error }) => ({
        ...state,
        error,
        status: 'error',
    }))
);

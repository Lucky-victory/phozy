import { Action, createReducer, on } from '@ngrx/store';
import { PHOTO_RESULT } from 'src/app/interfaces/photo.interface';
import { STATE_STATUS } from '../app.state';
import {
    likeOrUnlikePhotosByUserSuccess,
    likePhoto,
    loadPhotosByUser,
    loadPhotosByUserFailure,
    loadPhotosByUserSuccess,
    unlikePhoto,
} from './photos-by-user.actions';

export interface PhotosByUserState {
    photos: PHOTO_RESULT[];
    status: STATE_STATUS;
    is_at_end: boolean;
    error: string;
}

export const initialPhotosByUserState: PhotosByUserState = {
    photos: [],
    status: 'pending',
    is_at_end: false,
    error: null,
};
export const photosByUserReducer = createReducer(
    initialPhotosByUserState,
    on(likePhoto, (state, action) => ({
        ...state,

        error: null,
    })),
    on(unlikePhoto, (state, action) => ({
        ...state,

        error: null,
    })),
    on(likeOrUnlikePhotosByUserSuccess, (state, { photo: updatedPhoto }) => ({
        ...state,
        status: 'complete',
        error: null,
        photos: [
            ...state.photos.map((photo) => {
                return photo.id === updatedPhoto.id ? updatedPhoto : photo;
            }),
        ],
    })),
    on(loadPhotosByUser, (state) => ({
        ...state,
        error: null,
        status: 'pending',
    })),
    on(loadPhotosByUserSuccess, (state, { photos }) => ({
        ...state,
        photos,
        status: 'complete',
    })),
    on(loadPhotosByUserFailure, (state, { error }) => ({
        ...state,
        error,
        status: 'error',
    }))
);

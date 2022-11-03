import { Action, createReducer, on } from '@ngrx/store';
import { PHOTO_RESULT } from 'src/app/interfaces/photo.interface';
import { STATE_STATUS } from '../app.state';
import { photoSearch, photoSearchSuccess } from './photo-search.actions';

export const photoSearchFeatureKey = 'photoSearch';

export interface photoSearchState {
    photos: PHOTO_RESULT[];
    status: STATE_STATUS;
    error: string;
}

export const initialState: photoSearchState = {
    photos: [],
    error: null,
    status: 'pending',
};

export const photoSearchReducer = createReducer(
    initialState,
    on(photoSearch, (state) => ({ ...state, status: 'pending' })),
    on(photoSearchSuccess, (state, { photos }) => ({
        ...state,
        photos,
        status: 'complete',
    }))
);

import { createAction, props } from '@ngrx/store';
import { PHOTO_RESULT } from 'src/app/interfaces/photo.interface';

export const photoSearch = createAction(
    '[PhotoSearch] PhotoSearch ',
    props<{ query: string; page?: number; perPage?: number }>()
);

export const photoSearchSuccess = createAction(
    '[PhotoSearch] PhotoSearch Success',
    props<{ photos: PHOTO_RESULT[] }>()
);

export const photoSearchFailure = createAction(
    '[PhotoSearch] PhotoSearch Failure',
    props<{ error: string }>()
);

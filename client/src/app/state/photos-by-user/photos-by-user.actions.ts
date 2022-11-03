import { createAction, props } from '@ngrx/store';
import { PHOTO_RESULT } from 'src/app/interfaces/photo.interface';

export const likePhoto = createAction(
    '[PhotosByUser] Like Photo',
    props<{ id: PHOTO_RESULT['id'] }>()
);
export const unlikePhoto = createAction(
    '[PhotosByUser] UnLike Photo',
    props<{ id: PHOTO_RESULT['id'] }>()
);
export const loadPhotosByUser = createAction(
    '[PhotosByUser] load PhotosByUser',
    props<{ username: string }>()
);
export const likeOrUnlikePhotosByUserSuccess = createAction(
    '[PhotosByUser] LIKE OR UNLIKE',
    props<{ photo: PHOTO_RESULT }>()
);

export const loadPhotosByUserSuccess = createAction(
    '[PhotosByUser] load PhotosByUser Success',
    props<{ photos: PHOTO_RESULT[] }>()
);

export const loadPhotosByUserFailure = createAction(
    '[PhotosByUser] load PhotosByUser Failure',
    props<{ error: string }>()
);

import { createAction, props } from '@ngrx/store';
import { PHOTO_TO_VIEW } from '../../interfaces/photo.interface';

export const likePhoto = createAction(
    '[Photos] Like Photo',
    props<{ id: PHOTO_TO_VIEW['id'] }>()
);
export const unlikePhoto = createAction(
    '[Photos] UnLike Photo',
    props<{ id: PHOTO_TO_VIEW['id'] }>()
);

export const loadPhotos = createAction('[Photos] Load Photos');
export const loadPhotosByUser = createAction(
    '[Photos] Load Photos By User',
    props<{ username: string }>()
);
export const loadOnePhoto = createAction(
    '[Photos] Load One Photo',
    props<{ id: string }>()
);
export const loadOnePhotoSuccess = createAction(
    '[Photos] Load One Photo',
    props<{ photo: PHOTO_TO_VIEW }>()
);
export const loadPhotosByUserSuccess = createAction(
    '[Photos] Load Photos By User Success',
    props<{ photos: PHOTO_TO_VIEW[] }>()
);
export const loadPhotosByUserFailure = createAction(
    '[Photos] Load Photos By User Failure',
    props<{ error: string }>()
);
export const loadPaginatedPhotos = createAction(
    '[Photos] paginated photos',
    props<{ page: number; perPage?: number }>()
);
export const loadPaginatedPhotosSuccess = createAction(
    '[Photos] paginated photos Success',
    props<{ photos: PHOTO_TO_VIEW[] }>()
);

export const photoLikeOrUnlikeSuccess = createAction(
    '[Photos] Like Or Unlike Success',
    props<{ photo: PHOTO_TO_VIEW }>()
);

export const photosLoadFailure = createAction(
    '[Photos] Photos Load Failure',
    props<{ error: string }>()
);
export const photosLoadSuccess = createAction(
    '[Photos] Photos Load Success',
    props<{ photos: PHOTO_TO_VIEW[] }>()
);

import { createAction, props } from '@ngrx/store';

export const photosByUserPhotosByUsers = createAction(
  '[PhotosByUser] PhotosByUser PhotosByUsers'
);

export const photosByUserPhotosByUsersSuccess = createAction(
  '[PhotosByUser] PhotosByUser PhotosByUsers Success',
  props<{ data: any }>()
);

export const photosByUserPhotosByUsersFailure = createAction(
  '[PhotosByUser] PhotosByUser PhotosByUsers Failure',
  props<{ error: any }>()
);

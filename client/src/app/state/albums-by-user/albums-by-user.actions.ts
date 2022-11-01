import { createAction, props } from '@ngrx/store';

export const albumsByUserAlbumsByUsers = createAction(
  '[AlbumsByUser] AlbumsByUser AlbumsByUsers'
);

export const albumsByUserAlbumsByUsersSuccess = createAction(
  '[AlbumsByUser] AlbumsByUser AlbumsByUsers Success',
  props<{ data: any }>()
);

export const albumsByUserAlbumsByUsersFailure = createAction(
  '[AlbumsByUser] AlbumsByUser AlbumsByUsers Failure',
  props<{ error: any }>()
);

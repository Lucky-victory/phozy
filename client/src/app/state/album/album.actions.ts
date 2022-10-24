import { createAction, props } from '@ngrx/store';
import { ALBUM_RESULT, NEW_ALBUM } from 'src/app/interfaces/album.interface';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';

export const loadAlbums = createAction(
  '[Album] Load Albums'
);
export const createAlbum = createAction(
  '[Album] Create Album',props<{album:NEW_ALBUM}>()
);
export const createAlbumSuccess = createAction(
  '[Album] Create Album Success',props<{album:ALBUM_RESULT}>()
);

export const loadAlbumsSuccess = createAction(
  '[Album] load Albums Success',
  props<{ albums: ALBUM_RESULT[] }>()
);
export const collectPhoto = createAction(
  '[Cards Component] Collect Photo',
  props<{albumId:string, photoId: PHOTO_TO_VIEW ['id']}>()
);
export const collectPhotoSuccess = createAction(
  '[Cards Component] Collect Photo Success',
  props<{album:ALBUM_RESULT}>()
);
export const loadAlbumsFailure = createAction(
  '[Album] load Albums Failure',
  props<{ error: string }>()
);

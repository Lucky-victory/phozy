import { createAction, props } from '@ngrx/store';
import { PHOTO_TO_VIEW } from './interfaces/photo.interface';

export const likePhoto = createAction(
  '[Cards Component] Like Photo',props<PHOTO_TO_VIEW>
);

export const collectPhoto = createAction(
  '[Cards Component] Collect Photo',
  props<PHOTO_TO_VIEW>()
);
export const loadPhotos = createAction(
  '[Photos] Load Photos',
  props<PHOTO_TO_VIEW>()
);

export const photosFailure = createAction(
  '[Photo] Photo  Failure',
  props<{ error: any }>()
);

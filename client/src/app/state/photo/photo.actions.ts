import { createAction, props } from '@ngrx/store';
import { PHOTO_TO_VIEW } from '../../interfaces/photo.interface';

export const likePhoto = createAction(
  '[Cards Component] Like Photo', props<{ id: PHOTO_TO_VIEW['id'] }>()
);
export const unlikePhoto = createAction(
  '[Cards Component] UnLike Photo', props<{ id: PHOTO_TO_VIEW['id'] }>()
);

export const collectPhoto = createAction(
  '[Cards Component] Collect Photo',
  props<{ id: PHOTO_TO_VIEW ['id']}>()
);
export const loadPhotos = createAction(
  '[Photos] Load Photos',
 
);
export const photoLikeOrUnlikeSuccess=createAction('[Cards Component] Like Or Unlike Success',props<{photo:PHOTO_TO_VIEW}>())
export const photosFailure = createAction(
  '[Photo] Photo  Failure',
  props<{ error: any }>()
);
export const photosLoadSuccess = createAction(
  '[Photos] Photos Success',props<{photos:PHOTO_TO_VIEW[]}>()
);

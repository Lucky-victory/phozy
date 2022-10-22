import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap,} from 'rxjs/operators';
import { PhotoService } from '../../services/photo/photo.service';
import { AppState } from '../app.state';
import { likePhoto, loadPhotos, photoLikeOrUnlikeSuccess, photosLoadSuccess, unlikePhoto } from './photo.actions';




@Injectable()
export class PhotoEffects {
 
  loadPhotos$ = createEffect(() => this.actions$.pipe(ofType(loadPhotos), switchMap(() => this.photoService.getAll$().pipe(map((photos) => photosLoadSuccess({ photos }))))))

  likePhoto$ = createEffect(() => this.actions$.pipe(ofType(likePhoto), switchMap(({ id }) => this.photoService.likePhoto(id).pipe(map((photo) => photoLikeOrUnlikeSuccess({ photo }))))))
  
  unlikePhoto$=createEffect(()=>this.actions$.pipe(ofType(unlikePhoto),switchMap(({id})=>{
    return this.photoService.unlikePhoto(id).pipe(map((photo) => photoLikeOrUnlikeSuccess({photo})));
  })))
  
  constructor(private actions$: Actions,private photoService:PhotoService,private store:Store<AppState>) {}
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { PhotoService } from '../../services/photo/photo.service';
import { AppState } from '../app.state';
import { likePhoto, loadOnePhoto, loadOnePhotoSuccess, loadPaginatedPhotos, loadPaginatedPhotosSuccess, loadPhotos, photoLikeOrUnlikeSuccess, photosLoadSuccess, unlikePhoto } from './photo.actions';




@Injectable()
export class PhotoEffects {
 
  loadPhotos$ = createEffect(() => this.actions$.pipe(ofType(loadPhotos), switchMap(() => this.photoService.getAll$().pipe(map((photos) => photosLoadSuccess({ photos }))))))
  loadOnePhoto$ = createEffect(() => this.actions$.pipe(ofType(loadOnePhoto), switchMap(({id}) => this.photoService.getPhoto$(id).pipe(map((photo) => loadOnePhotoSuccess({ photo }))))))

  likePhoto$ = createEffect(() => this.actions$.pipe(ofType(likePhoto), switchMap(({ id }) => this.photoService.likePhoto(id).pipe(map((photo) => photoLikeOrUnlikeSuccess({ photo }))))))
  
  unlikePhoto$=createEffect(()=>this.actions$.pipe(ofType(unlikePhoto),switchMap(({id})=>{
    return this.photoService.unlikePhoto(id).pipe(map((photo) => photoLikeOrUnlikeSuccess({photo})));
  })))
loadPaginatedPhotos$=createEffect(()=>this.actions$.pipe(ofType(loadPaginatedPhotos),switchMap(({page,perPage})=>this.photoService.getAll$(page,perPage).pipe(map((photos)=>loadPaginatedPhotosSuccess({photos}))))))
  
  constructor(private actions$: Actions,private photoService:PhotoService,private store:Store<AppState>) {}
}

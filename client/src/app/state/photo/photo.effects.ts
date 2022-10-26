import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { catchError, concatMap, map, } from 'rxjs/operators';
import { PhotoService } from '../../services/photo/photo.service';
import { AppState } from '../app.state';
import { likePhoto, loadOnePhoto, loadOnePhotoSuccess, loadPaginatedPhotos, loadPaginatedPhotosSuccess, loadPhotos, photoLikeOrUnlikeSuccess, photosLoadSuccess, unlikePhoto } from './photo.actions';




@Injectable()
export class PhotoEffects {
 
  loadPhotos$ = createEffect(() => this.actions$.pipe(ofType(loadPhotos), concatMap(() => this.photoService.getAll$().pipe(map((photos) => photosLoadSuccess({ photos }))))))
  
  likePhoto$ = createEffect(() => this.actions$.pipe(ofType(likePhoto), concatMap(({ id }) => this.photoService.likePhoto(id).pipe(map((photo) => photoLikeOrUnlikeSuccess({ photo })),catchError(()=>EMPTY)))))
  
  unlikePhoto$=createEffect(()=>this.actions$.pipe(ofType(unlikePhoto),concatMap(({id})=>{
    return this.photoService.unlikePhoto(id).pipe(map((photo) => photoLikeOrUnlikeSuccess({photo})),catchError(()=>EMPTY));
  })))
loadPaginatedPhotos$=createEffect(()=>this.actions$.pipe(ofType(loadPaginatedPhotos),concatMap(({page,perPage})=>this.photoService.getAll$(page,perPage).pipe(map((photos)=>loadPaginatedPhotosSuccess({photos})),))))
  
  constructor(private actions$: Actions,private photoService:PhotoService,private store:Store<AppState>) {}
}

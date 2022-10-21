import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { PhotoService } from '../../services/photo/photo.service';
import { AppState } from '../app.state';
import { likePhoto, loadPhotos, photosLoadSuccess, unlikePhoto } from './photo.actions';
import { selectAllPhotos } from './photo.selectors';



@Injectable()
export class PhotoEffects {
 
  loadPhotos$ = createEffect(() => this.actions$.pipe(ofType(loadPhotos), switchMap(() => this.photoService.getAll$().pipe(map((photos) => photosLoadSuccess({ photos }))))))
  likePhoto$=createEffect(()=>this.actions$.pipe(ofType(likePhoto),withLatestFrom(this.store.select(selectAllPhotos)),switchMap(([{id}])=>this.photoService.likePhoto(id).pipe(map((photo)=>{photo})))),{dispatch:false})
  unlikePhoto$=createEffect(()=>this.actions$.pipe(ofType(unlikePhoto),withLatestFrom(this.store.select(selectAllPhotos)),switchMap(([{id}])=>{
    return this.photoService.unlikePhoto(id).pipe(map((photo) => { photo; }));
  })),{dispatch:false})
  
  constructor(private actions$: Actions,private photoService:PhotoService,private store:Store<AppState>) {}
}

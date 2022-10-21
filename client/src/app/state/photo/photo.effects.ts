import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { PhotoService } from '../../services/photo/photo.service';
import { loadPhotos } from './photo.actions';



@Injectable()
export class PhotoEffects {

loadPhotos$=createEffect(()=>this.actions$.pipe(ofType(loadPhotos),mergeMap(()=>this.photoService.getAll$().pipe(map((photos)=> ({ type: '[Photos API] Photos Loaded Success',  photos}))))))
  constructor(private actions$: Actions,private photoService:PhotoService) {}
}

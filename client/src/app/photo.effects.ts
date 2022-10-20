import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap ,map} from 'rxjs/operators';
import { PhotoService } from './services/photo/photo.service';



@Injectable()
export class PhotoEffects {

loadPhotos$=createEffect(()=>this.actions$.pipe(ofType('[Photos] Load Photos'),mergeMap(()=>this.photoService.getAll$().pipe(map((photos)=> ({ type: '[Photos API] Photos Loaded Success', payload: photos}))))))
  constructor(private actions$: Actions,private photoService:PhotoService) {}
}

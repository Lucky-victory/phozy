import { photoSearch, photoSearchSuccess } from './photo-search.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class PhotoSearchEffects {
    searchPhoto$ = createEffect(() =>
        this.actions$.pipe(
            ofType(photoSearch),
            switchMap(({ query, page, perPage }) =>
                this.photoService
                    .search$(query, page, perPage)
                    .pipe(map((photos) => photoSearchSuccess({ photos })))
            )
        )
    );
    constructor(
        private actions$: Actions,
        private photoService: PhotoService
    ) {}
}

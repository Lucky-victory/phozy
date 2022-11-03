import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { PhotoService } from '../../services/photo/photo.service';
import { AppState } from '../app.state';
import {
    likePhoto,
    loadPaginatedPhotos,
    loadPaginatedPhotosSuccess,
    loadPhotos,
    
    photoLikeOrUnlikeSuccess,
    photosLoadFailure,
    photosLoadSuccess,
    unlikePhoto,
} from './photo.actions';

@Injectable()
export class PhotoEffects {
    loadPhotos$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadPhotos),
            switchMap(() =>
                this.photoService.getAll$().pipe(
                    map((photos) => photosLoadSuccess({ photos })),
                    catchError(() =>
                        of(
                            photosLoadFailure({
                                error: "Sorry, couldn't load photos, Try again",
                            })
                        )
                    )
                )
            )
        )
    );

    likePhoto$ = createEffect(() =>
        this.actions$.pipe(
            ofType(likePhoto),
            switchMap(({ id }) =>
                this.photoService.likePhoto(id).pipe(
                    map((photo) => photoLikeOrUnlikeSuccess({ photo })),
                    catchError(() => EMPTY)
                )
            )
        )
    );

    unlikePhoto$ = createEffect(() =>
        this.actions$.pipe(
            ofType(unlikePhoto),
            switchMap(({ id }) => {
                return this.photoService.unlikePhoto(id).pipe(
                    map((photo) => photoLikeOrUnlikeSuccess({ photo })),
                    catchError(() => EMPTY)
                );
            })
        )
    );
    loadPaginatedPhotos$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadPaginatedPhotos),
            switchMap(({ page, perPage }) =>
                this.photoService.getAll$(page, perPage).pipe(
                    map((photos) => loadPaginatedPhotosSuccess({ photos })),
                    catchError(() =>
                        of(
                            photosLoadFailure({
                                error: "Sorry, couldn't load photos, Try again",
                            })
                        )
                    )
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private photoService: PhotoService,
        private store: Store<AppState>
    ) {}
}

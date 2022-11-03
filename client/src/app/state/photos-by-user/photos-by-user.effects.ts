import { PhotoService } from 'src/app/services/photo/photo.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    likeOrUnlikePhotosByUserSuccess,
    likePhoto,
    loadPhotosByUser,
    loadPhotosByUserFailure,
    loadPhotosByUserSuccess,
    unlikePhoto,
} from './photos-by-user.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class PhotosByUserEffects {
    loadPhotosByUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadPhotosByUser),
            switchMap(({ username }) =>
                this.photoService.getPhotosByUser$(username).pipe(
                    map((photos) => loadPhotosByUserSuccess({ photos })),
                    catchError(() =>
                        of(
                            loadPhotosByUserFailure({
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
                    map((photo) => likeOrUnlikePhotosByUserSuccess({ photo })),
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
                    map((photo) => likeOrUnlikePhotosByUserSuccess({ photo })),
                    catchError(() => EMPTY)
                );
            })
        )
    );
    constructor(
        private actions$: Actions,
        private photoService: PhotoService
    ) {}
}

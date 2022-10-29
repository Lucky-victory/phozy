import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AlbumService } from 'src/app/services/album/album.service';
import {
    collectPhoto,
    collectPhotoFailure,
    collectPhotoSuccess,
    createAlbum,
    createAlbumSuccess,
    loadAlbums,
    loadAlbumsFailure,
    loadAlbumsSuccess,
} from './album.actions';

@Injectable()
export class AlbumEffects {
    loadAlbums$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadAlbums),
            switchMap(() =>
                this.albumService.getAll$().pipe(
                    map((albums) => loadAlbumsSuccess({ albums })),
                    catchError(() =>
                        of(
                            loadAlbumsFailure({
                                error: "Sorry, couldn't load albums, Try again",
                            })
                        )
                    )
                )
            )
        )
    );
    createAlbum$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createAlbum),
            switchMap(({ album }) =>
                this.albumService.createAlbum$(album).pipe(
                    map((album) => createAlbumSuccess({ album })),
                    catchError(() =>
                        of(
                            loadAlbumsFailure({
                                error: "Sorry, couldn't create album, Try again",
                            })
                        )
                    )
                )
            )
        )
    );
    addPhotoToAlbum$ = createEffect(() =>
        this.actions$.pipe(
            ofType(collectPhoto),
            switchMap(({ photoId, albumId }) =>
                this.albumService.addPhotoToAlbum$(albumId, photoId).pipe(
                    map(
                        (album) => collectPhotoSuccess({ album }),
                        catchError(() =>
                            of(
                                collectPhotoFailure({
                                    error: "Couldn't add photo to album, Try again ",
                                })
                            )
                        )
                    )
                )
            )
        )
    );
    constructor(
        private actions$: Actions,
        private albumService: AlbumService
    ) {}
}

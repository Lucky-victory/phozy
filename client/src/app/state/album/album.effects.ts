import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { AlbumService } from 'src/app/services/album/album.service';
import { collectPhoto, collectPhotoSuccess, createAlbum, createAlbumSuccess, loadAlbums, loadAlbumsSuccess } from './album.actions';



@Injectable()
export class AlbumEffects {
loadAlbums$=createEffect(()=>this.actions$.pipe(ofType(loadAlbums),switchMap(()=>this.albumService.getAll$().pipe(map((albums)=>loadAlbumsSuccess({albums}))))))
createAlbum$=createEffect(()=>this.actions$.pipe(ofType(createAlbum),switchMap(({album})=>this.albumService.createAlbum$(album).pipe(map((album)=>createAlbumSuccess({album}))))))
addPhotoToAlbum$=createEffect(()=>  this.actions$.pipe(ofType(collectPhoto), switchMap(({ photoId, albumId }) => this.albumService.addPhotoToAlbum$(albumId, photoId).pipe(map(album=>collectPhotoSuccess({album}))))));
  constructor(private actions$: Actions,private albumService:AlbumService) {}
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap,map } from 'rxjs/operators';
import { AlbumService } from 'src/app/services/album/album.service';
import { createAlbum, createAlbumSuccess, loadAlbums, loadAlbumsSuccess } from './album.actions';



@Injectable()
export class AlbumEffects {
loadAlbums$=createEffect(()=>this.actions$.pipe(ofType(loadAlbums),switchMap(()=>this.albumService.getAll$().pipe(map((albums)=>loadAlbumsSuccess({albums}))))))
createAlbum$=createEffect(()=>this.actions$.pipe(ofType(createAlbum),switchMap(({album})=>this.albumService.createNewCollection(album).pipe(map((album)=>createAlbumSuccess({album}))))))

  constructor(private actions$: Actions,private albumService:AlbumService) {}
}

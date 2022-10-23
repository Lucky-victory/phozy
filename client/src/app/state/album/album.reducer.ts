import { createReducer,on } from '@ngrx/store';
import { ALBUM_RESULT } from 'src/app/interfaces/album.interface';
import { AlbumService } from 'src/app/services/album/album.service';
import { createAlbum, createAlbumSuccess, loadAlbums, loadAlbumsSuccess } from './album.actions';


export const albumFeatureKey = 'album';

export interface AlbumsState {
albums:ALBUM_RESULT[]
}

export const initialState: AlbumsState = {
albums:[]
};

export const albumReducer = createReducer(
  initialState,
on(loadAlbums,(state)=>({...state})),on(loadAlbumsSuccess,(state,{albums})=>({...state,albums:albums})),on(createAlbum,(state,{album})=>({...state})),on(createAlbumSuccess,(state,{album})=>({state,albums:[...state.albums,album]}))
);

import { createReducer,on } from '@ngrx/store';
import { ALBUM_RESULT } from 'src/app/interfaces/album.interface';
import { AlbumService } from 'src/app/services/album/album.service';
import { STATE_STATUS } from '../app.state';
import { collectPhoto, collectPhotoSuccess, createAlbum, createAlbumSuccess, loadAlbums, loadAlbumsSuccess } from './album.actions';


export const albumFeatureKey = 'album';

export interface AlbumsState {
  albums: ALBUM_RESULT[];
  status:STATE_STATUS
}

export const initialState: AlbumsState = {
  albums: [],
  status:'pending'

};

export const albumReducer = createReducer(
  initialState, on(collectPhoto,(state,action)=>({...state})),
  on(collectPhotoSuccess,(state,{album})=>({...state,status:'complete',albums: state.albums.map((_album) => {
      if (_album.id !== album.id) return _album;
      return album
    })})),
on(loadAlbums,(state)=>({...state})),on(loadAlbumsSuccess,(state,{albums})=>({...state,albums:albums,status:'complete'})),on(createAlbum,(state,{album})=>({...state})),on(createAlbumSuccess,(state,{album})=>({...state,albums:[...state.albums,album],status:'complete'}))
);

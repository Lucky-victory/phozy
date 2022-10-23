import { AlbumsState } from "./album/album.reducer";
import { PhotosState } from "./photo/photo.reducer";

export interface AppState{
    photos:PhotosState,
    albums:AlbumsState
}
import { AlbumsState } from "./album/album.state";
import { PhotosState } from "./photo/photo.reducer";

export interface AppState{
    photos:PhotosState,
    albums:AlbumsState
}
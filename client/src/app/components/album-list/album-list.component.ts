import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ALBUM_RESULT } from 'src/app/interfaces/album.interface';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { AppState } from 'src/app/state/app.state';
import { collectPhoto } from 'src/app/state/photo/photo.actions';
import { AlbumItemComponent } from '../album-item/album-item.component';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css'],standalone:true,imports:[CommonModule,IonicModule,AlbumItemComponent]
})
export class AlbumListComponent implements OnInit {
  @Input() albums$!: Observable<ALBUM_RESULT[]>;
  @Input() photo:PHOTO_TO_VIEW
  constructor(private store:Store<AppState>) { }

  ngOnInit() {}
  selectAlbum({ album, photo }: { album: ALBUM_RESULT, photo: PHOTO_TO_VIEW }) {
    console.log({album,photo},'album list');
    
  this.store.dispatch(collectPhoto({albumId:album.id,photoId:photo.id}))
}
}

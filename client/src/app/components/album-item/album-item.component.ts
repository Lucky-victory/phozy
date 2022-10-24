import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ALBUM_RESULT } from 'src/app/interfaces/album.interface';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';

@Component({
  selector: 'app-album-item',
  templateUrl: './album-item.component.html',
  styleUrls: ['./album-item.component.css'],standalone:true,imports:[CommonModule,IonicModule]
})
export class AlbumItemComponent implements OnInit {
  @Input() album: ALBUM_RESULT;
  @Output() onAlbumSelect = new EventEmitter<{ album: ALBUM_RESULT ,photo:PHOTO_TO_VIEW}>();
  @Input() photo:PHOTO_TO_VIEW
  constructor() { }

  ngOnInit() {}
  selectAlbum(album: ALBUM_RESULT,photo:PHOTO_TO_VIEW) {
    this.onAlbumSelect.emit({ album,photo })
}
}

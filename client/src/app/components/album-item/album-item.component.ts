import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ALBUM_RESULT } from 'src/app/interfaces/album.interface';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { selectAlbumsStatus } from 'src/app/state/album/album.selectors';
import { AppState, STATE_STATUS } from 'src/app/state/app.state';

@Component({
    selector: 'app-album-item',
    templateUrl: './album-item.component.html',
    styleUrls: ['./album-item.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule],
})
export class AlbumItemComponent implements OnInit {
    @Input() album: ALBUM_RESULT;
    @Output() onAlbumSelect = new EventEmitter<{
        album: ALBUM_RESULT;
        photo: PHOTO_TO_VIEW;
    }>();
    @Input() photo: PHOTO_TO_VIEW;
    isCollected!: boolean;
    isAdding$: Observable<STATE_STATUS>;
    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        const photosInAlbumIds = this?.album?.photos?.map((photo) => photo?.id);
        console.log(photosInAlbumIds, 'ids');
        this.isAdding$ = this.store.select(selectAlbumsStatus);
        this.isCollected = photosInAlbumIds.includes(this?.photo?.id);
        console.log(this.isCollected, 'collected');
    }
    selectAlbum(album: ALBUM_RESULT, photo: PHOTO_TO_VIEW) {
        this.onAlbumSelect.emit({ album, photo });
    }
}

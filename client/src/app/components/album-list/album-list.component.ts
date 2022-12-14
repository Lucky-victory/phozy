import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ALBUM_RESULT } from 'src/app/interfaces/album.interface';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { collectPhoto } from 'src/app/state/album/album.actions';
import { selectAlbumsStatus,selectAllAlbums } from 'src/app/state/album/album.selectors';
import { AppState, STATE_STATUS } from 'src/app/state/app.state';

import { AlbumItemComponent } from '../album-item/album-item.component';

@Component({
    selector: 'app-album-list',
    templateUrl: './album-list.component.html',
    styleUrls: ['./album-list.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, AlbumItemComponent, RouterModule],
})
export class AlbumListComponent implements OnInit {
    @Input() albums$ = this.store.select(selectAllAlbums);
    @Input() photo: PHOTO_TO_VIEW;
    @Input() isLoaded$: Observable<STATE_STATUS>;
    skeletons = new Array(3).map((_, i) => i);
    constructor(
        private store: Store<AppState>,
        private modalCtrl: ModalController
    ) {}

    ngOnInit() {
        this.isLoaded$ = this.store.select(selectAlbumsStatus);
    }
    selectAlbum({
        album,
        photo,
    }: {
        album: ALBUM_RESULT;
        photo: PHOTO_TO_VIEW;
    }) {
        this.store.dispatch(
            collectPhoto({ albumId: album.id, photoId: photo.id })
        );
    }
    async createAlbum() {
        await this.modalCtrl.dismiss();
    }
}

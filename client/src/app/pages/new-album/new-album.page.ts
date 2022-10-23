import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ALBUM_RESULT, NEW_ALBUM } from 'src/app/interfaces/album.interface';

import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { createAlbum, loadAlbums } from 'src/app/state/album/album.actions';
import { selectAllAlbums } from 'src/app/state/album/album.selectors';
import { AppState } from 'src/app/state/app.state';
import { INewAlbumForm } from '../../interfaces/new-album.interface';

@Component({
    selector: 'app-new-album',
    templateUrl: './new-album.page.html',
    styleUrls: ['./new-album.page.scss'],
})
export class NewAlbumPage implements OnInit{
    albums$: Observable<ALBUM_RESULT[]>
    isSending: boolean;
    isChecked = false;
    newAlbumForm: FormGroup<INewAlbumForm>;
    infoMessage: string;
    constructor(
        private formBuilder: FormBuilder,
        private store:Store<AppState>,private utilsService:UtilitiesService
    ) {
        this.newAlbumForm = this.formBuilder.group({
            is_public: [true],
            description: [''],
            title: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(30),
                ],
            ],
        });
    }
    ngOnInit(): void {
        this.store.dispatch(loadAlbums());
        this.albums$ = this.store.select(selectAllAlbums);
}
    addNewAlbum(event: Event) {
        this.isSending = true;
        event.preventDefault();
        const is_public = this.newAlbumForm.get('is_public').value;
        const title = this.newAlbumForm.get('title').value;
        const description = this.newAlbumForm.get('description').value;
        const newAlbum: NEW_ALBUM = {
            title, description, is_public
        }
        this.store.dispatch(createAlbum({ album: newAlbum }))
    }
      async showToast() {
        await this.utilsService.showToast({
            message:this.infoMessage
        })
    }
}

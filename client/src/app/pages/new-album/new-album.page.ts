import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { INewAlbumForm } from '../../interfaces/new-album.interface';

@Component({
    selector: 'app-new-album',
    templateUrl: './new-album.page.html',
    styleUrls: ['./new-album.page.scss'],
})
export class NewAlbumPage {
    isSending: boolean;
    isChecked = false;
    newAlbumForm: FormGroup<INewAlbumForm>;
    infoMessage: string;
    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,private utilsService:UtilitiesService
    ) {
        this.newAlbumForm = this.formBuilder.group({
            privacy: [false],
            description: [''],
            title: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(30),
                ],
            ],
        });
    }

    addNewAlbum(event: Event) {
        this.isSending = true;
        event.preventDefault();
        const privacy = this.newAlbumForm.get('is_public').value;
        const title = this.newAlbumForm.get('title').value;
        const description = this.newAlbumForm.get('description').value;
        this.apiService
            .createNewCollection(title, description, privacy)
            .subscribe(
                (res) => {
                    this.isSending = false;
                    this.infoMessage = 'Album successfully added';
                    this.showToast()
                },
                (error) => {
                    this.isSending = false;
                    this.infoMessage = "An error occured couldn't create album";
                    this.showToast()
                }
            );
        setTimeout(() => {
            this.newAlbumForm.reset();
            this.infoMessage = '';
        }, 2000);
    }
      async showToast() {
        await this.utilsService.showToast({
            message:this.infoMessage
        })
    }
}

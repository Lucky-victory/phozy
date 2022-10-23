import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ALBUM_RESULT } from 'src/app/interfaces/album.interface';


import { PHOTO_FROM_CLIENT } from 'src/app/interfaces/photo.interface';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';

@Component({
    selector: 'app-new-photo',
    templateUrl: './new-photo.page.html',
    styleUrls: ['./new-photo.page.scss'],
})
export class NewPhotoPage implements OnInit {
    isSending: boolean = false;
    photosToPreview: PHOTO_FROM_CLIENT[] = [];
    photosToUpload: Partial<PHOTO_FROM_CLIENT[]> = [];
    userAlbums: ALBUM_RESULT[] = [];
    maxPhotoCount = 10;

    infoMessage!: string;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private authService: AuthService,private utilsService:UtilitiesService
    ) {}

    ngOnInit() {
        // this.fetchUserAlbums();
    }
    removeImage(id: string) {
        this.photosToPreview = this.photosToPreview.filter(
            (preview) => preview.id !== id
        );
        this.photosToUpload = this.photosToUpload.filter(
            (photo) => photo.id !== id
        );
    }
    fetchUserAlbums() {
        const user = this.authService.getUser();
        this.apiService
            .getUserCollections(user?.username as string)
            .subscribe((res) => {
                this.userAlbums = res.data as ALBUM_RESULT[];
            });
    }
    ionViewDidEnter(): void {
        // this.fetchUserAlbums();
    }

    addNewPhoto() {
        // const albumId = this.newPhotoForm.get('prevAlbums').value;
        this.isSending = true;
        console.log(this.photosToPreview, 'preview');
        const photosToPreview = [...this.photosToPreview];
        let newPhoto: PHOTO_FROM_CLIENT;
        this.photosToUpload = photosToPreview.reduce((accum, preview) => {
            for (const photo of this.photosToUpload) {
                if (photo.id === preview.id) {
                    newPhoto = Object.assign({}, preview, photo);
                    accum.push(newPhoto);
                }
            }

            return accum;
        }, [] as PHOTO_FROM_CLIENT[]);

        this.apiService.uploadPhotos(this.photosToUpload).subscribe(
            (res) => {
                this.isSending = false;
                this.photosToPreview = [];
                this.infoMessage = 'Photos uploaded successfully';
                this.showToast()
            },
            (error) => {
                this.isSending = false;
                this.infoMessage = 'Sorry, an error occurred please try again';
                this.showToast()
            }
        );
    }
    loadImageFromDevice(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        const filesArray = Array.from(files);
        if (filesArray.length > this.maxPhotoCount) {
            this.infoMessage = `You have chosen more than ${this.maxPhotoCount} images`;
            this.showToast();
            return;
        }
        if (files.length > 0) {
            for (const file of filesArray) {
                const reader = new FileReader();
                let result = '';
                reader.onload = () => {
                    result = reader.result as string;

                    const id = Math.random().toString(16).substring(2);
                    this.photosToUpload.push({ id, image: file });

                    this.photosToPreview.push({
                        id,
                        image: result,
                        tags: '',
                        caption: '',
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    }
    async showToast() {
        await this.utilsService.showToast({
            message:this.infoMessage
        })
    }
}

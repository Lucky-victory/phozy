import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAlbumResult } from 'src/app/interfaces/albums.interface';
import { IResponseResult } from 'src/app/interfaces/common';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { INewPhotoForm } from '../../interfaces/new-photo.interface';
interface Photo {
    id?: string;
    image: Blob | string;
    tags?: string;
    caption?: string;
}
@Component({
    selector: 'app-new-photo',
    templateUrl: './new-photo.page.html',
    styleUrls: ['./new-photo.page.scss'],
})
export class NewPhotoPage implements OnInit {
    isSending: boolean = false;
    photosToPreview: Photo[] = [];
    photosToUpload: Partial<Photo[]> = [];
    userAlbums: IAlbumResult[] = [];
    maxPhotoCount = 10;
    newPhotoForm!: FormGroup<INewPhotoForm>;
    infoMessage!: string;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private authService: AuthService
    ) {
        // this.newPhotoForm = this.formBuilder.group({
        //     photosUpload: ['', Validators.required],
        //     prevAlbums: ['', Validators.required],
        // });
    }

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
            .getUserAlbums(user?.username as string)
            .subscribe((res) => {
                this.userAlbums = res.data as IAlbumResult[];
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
        let newPhoto: Photo;
        this.photosToUpload = photosToPreview.reduce((accum, preview) => {
            for (const photo of this.photosToUpload) {
                if (photo.id === preview.id) {
                    newPhoto = Object.assign({}, preview, photo);
                    accum.push(newPhoto);
                }
            }

            return accum;
        }, [] as Photo[]);

        this.apiService.uploadPhotos(this.photosToUpload).subscribe(
            (res) => {
                this.isSending = false;
                // this.newPhotoForm.reset();
                this.photosToPreview = [];
                this.infoMessage = 'Photos uploaded successfully';
            },
            (error) => {
                this.isSending = false;
                this.infoMessage = 'Sorry, an error occurred please try again';
            }
        );
    }
    loadImageFromDevice(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        const filesArray = Array.from(files);
        if (filesArray.length > this.maxPhotoCount) {
            this.infoMessage = `You have chosen more than ${this.maxPhotoCount} images`;
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
                    console.log(this.photosToPreview, 'in load');
                };
                reader.readAsDataURL(file);
            }
        }
    }
}

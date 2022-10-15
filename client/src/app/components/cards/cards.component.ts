import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
    @Input() generalPhotos = [];
    @Input() isLoggedIn: boolean;
    @Output() onPhotoLike = new EventEmitter<[number, boolean]>();
    @Output() onAddToAlbum = new EventEmitter();
    @Input() loaded!: boolean;
    isModalOpen: boolean;
    photoForModal: any;
    isLiked: boolean;
    infoMessage!: string;
    skeletons = new Array(10).map((_, i) => i);
    constructor(private router: Router) {}

    ngOnInit() {}
    toProfile(photo) {
        this.router.navigate(['/profile', photo?.user?.username]);
    }
    like(photo) {
        if (!this.isLoggedIn) {
            this.infoMessage = ' please sign up or signIn';
            setTimeout(() => {
                this.infoMessage = undefined;
            }, 2000);
            return;
        }
        photo.liked = photo.liked;
        this.onPhotoLike.emit([photo, photo.liked]);
    }
    addToAlbum(photo) {
        if (!this.isLoggedIn) {
            this.infoMessage = ' please sign up or signIn';
            return;
        }

        this.onAddToAlbum.emit(photo);
    }
    showPhotoModal(photo) {
        this.isModalOpen = true;
        this.photoForModal = photo;
    }
    modalClose(isOpen: boolean) {
        this.isModalOpen = isOpen;
    }
    downloadPhoto(url: string) {
        saveAs(url);
    }
}

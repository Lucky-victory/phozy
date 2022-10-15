import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { saveAs } from 'file-saver';
import { CardComponent } from '../card/card.component';

import { NotifToastModule } from '../notif-toast/notif-toast.module';
import { PhotoModalComponent } from '../photo-modal/photo-modal.component';
@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule,
        CardComponent,
        RouterModule,
        PhotoModalComponent,
        NotifToastModule,
    ],
})
export class CardsComponent implements OnInit {
    @Input() generalPhotos = [];
    @Input() isLoggedIn: boolean;
    @Output() onLike = new EventEmitter<[any, boolean]>();
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
        this.onLike.emit([photo, photo.liked]);
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
    downloadPhoto(photo) {
        console.log(photo.url);

        saveAs(photo.url);
    }
    likePhoto(photo) {
        photo.liked = photo.liked;
        this.onLike.emit([photo, photo.liked]);
    }
    collectPhoto(photo) {}
}

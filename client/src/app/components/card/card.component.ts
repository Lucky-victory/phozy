import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, RouterModule],
})
export class CardComponent implements OnInit {
    @Input() photo!: PHOTO_TO_VIEW;
    @Output() onLike: EventEmitter<PHOTO_TO_VIEW> =
        new EventEmitter<PHOTO_TO_VIEW>();
    @Output() onDownload: EventEmitter<PHOTO_TO_VIEW> =
        new EventEmitter<PHOTO_TO_VIEW>();
    @Output() onCollect: EventEmitter<PHOTO_TO_VIEW> =
        new EventEmitter<PHOTO_TO_VIEW>();
    isLiked: boolean;
    constructor(private router: Router) {}

    ngOnInit(photo = this.photo) {
        this.isLiked = photo.liked;
    }

    collectPhoto(photo) {
        this.onCollect.emit(photo);
    }

    downloadPhoto(photo) {
        this.onDownload.emit(photo);
    }
    likePhoto(photo) {
        this.isLiked = !this.isLiked;
        this.onLike.emit(photo);
    }
    showPhotoModal(photo) {
        // this.router.navigate(['/photo', photo.id],{
        //     state:photo
        // });
    }
}

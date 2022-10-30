import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { PhotoOwnerComponent } from '../photo-owner/photo-owner.component';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, RouterModule, PhotoOwnerComponent],
})
export class CardComponent implements OnInit {
    @Input() photo!: PHOTO_TO_VIEW;
    @Output() onLike = new EventEmitter<[PHOTO_TO_VIEW, boolean]>();
    @Output() onDownload = new EventEmitter<PHOTO_TO_VIEW>();
    @Output() onCollect = new EventEmitter<PHOTO_TO_VIEW>();
    @Input() isLiked: boolean;
    constructor() {}

    ngOnInit(photo = this.photo) {
        this.isLiked = photo.is_liked;
    }

    collectPhoto(photo: PHOTO_TO_VIEW) {
        this.onCollect.emit(photo);
    }

    downloadPhoto(photo: PHOTO_TO_VIEW) {
        this.onDownload.emit(photo);
    }
    likePhoto(photo: PHOTO_TO_VIEW) {
        this.onLike.emit([photo, this.isLiked]);
        // this.isLiked = !this.isLiked;
    }
}

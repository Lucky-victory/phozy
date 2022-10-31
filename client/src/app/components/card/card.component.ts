import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';

import { PhotoOwnerComponent } from '../photo-owner/photo-owner.component';
import { SignInFormComponent } from '../sign-in-form/sign-in-form.component';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        PhotoOwnerComponent,
        SignInFormComponent,
    ],
})
export class CardComponent implements OnInit {
    @Input() photo!: PHOTO_TO_VIEW;
    @Output() onLike = new EventEmitter<[PHOTO_TO_VIEW, boolean]>();
    @Output() onDownload = new EventEmitter<PHOTO_TO_VIEW>();
    @Output() onCollect = new EventEmitter<PHOTO_TO_VIEW>();
    @Input() isLiked: boolean;
    @Input() isLoggedIn: boolean;
    constructor(private utilsService: UtilitiesService) {}

    ngOnInit(photo = this.photo) {
        this.isLiked = photo.is_liked;
    }

    collectPhoto(photo: PHOTO_TO_VIEW) {
        this.onCollect.emit(photo);
    }

    downloadPhoto(photo: PHOTO_TO_VIEW) {
        this.onDownload.emit(photo);
    }
    async likePhoto(photo: PHOTO_TO_VIEW) {
        if (!this.isLoggedIn) {
            await this.showModal();
            return;
        }
        this.onLike.emit([photo, this.isLiked]);
        this.isLiked = !this.isLiked;
    }
    async showModal() {
        this.utilsService.showModal({
            component: SignInFormComponent,
            componentProps: {
                isInModal: true,
            },
        });
    }
}

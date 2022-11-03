import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CardComponent } from '../card/card.component';

import {
    PHOTO_RESULT,
    PHOTO_TO_VIEW,
} from 'src/app/interfaces/photo.interface';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, CardComponent],
})
export class CardsComponent implements OnInit {
    @Input() photos$!: Observable<PHOTO_TO_VIEW[] | PHOTO_RESULT[]>;
    @Input() isLoggedIn: boolean;
    @Output() onLike = new EventEmitter<
        [PHOTO_TO_VIEW | PHOTO_RESULT, boolean]
    >();
    @Output() onCollect = new EventEmitter<PHOTO_TO_VIEW | PHOTO_RESULT>();
    @Output() onDownload = new EventEmitter<PHOTO_TO_VIEW | PHOTO_RESULT>();
    @Input() loaded: boolean = false;
    @Input() useState: boolean = true;
    @Input() showOwner: boolean = true;
    @Input() showTop: boolean = true;

    skeletons = new Array(10).map((_, i) => i);
    constructor() {}

    ngOnInit() {}

    downloadPhoto(photo: PHOTO_TO_VIEW | PHOTO_RESULT) {
        this.onDownload.emit(photo);
    }
    likePhoto([photo, isLiked]: [PHOTO_TO_VIEW | PHOTO_RESULT, boolean]) {
        this.onLike.emit([photo, isLiked]);
    }
    collectPhoto(photo: PHOTO_TO_VIEW | PHOTO_RESULT) {
        this.onCollect.emit(photo);
    }
}

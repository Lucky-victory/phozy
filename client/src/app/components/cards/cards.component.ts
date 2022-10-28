import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { CardComponent } from '../card/card.component';


import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { Observable } from 'rxjs';
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
    
    ],
})
export class CardsComponent implements OnInit {
    @Input() photos$!:Observable<PHOTO_TO_VIEW[]> ;
    @Input() isLoggedIn: boolean;
    @Output() onLike = new EventEmitter<[PHOTO_TO_VIEW,boolean]>();
    @Output() onCollect = new EventEmitter<PHOTO_TO_VIEW>();
    @Output() onDownload = new EventEmitter<PHOTO_TO_VIEW>();
    @Input() loaded!: boolean;
    
    isModalOpen: boolean;
    photoForModal: any;
    isLiked!: boolean;
    infoMessage!: string;
    skeletons = new Array(10).map((_, i) => i);
    constructor(private router: Router) {}

    ngOnInit() {}
   
    like(photo) {
        if (!this.isLoggedIn) {
            this.infoMessage = ' please sign up or signIn';
            setTimeout(() => {
                this.infoMessage = undefined;
            }, 2000);
            return;
        }
        photo.liked = photo.liked;
        this.onLike.emit(photo);
    }
 
  
    downloadPhoto(photo: PHOTO_TO_VIEW) {
        this.onDownload.emit(photo);
    }
    likePhoto([photo,isLiked]:[PHOTO_TO_VIEW,boolean]) {
        this.onLike.emit([photo,isLiked]);
    }
    collectPhoto(photo:PHOTO_TO_VIEW ) {
        this.onCollect.emit(photo)
    }
}

import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, RouterModule],
})
export class CardComponent implements OnInit {
    @Input() photo!: any;
    @Output() onLike: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDownload: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCollect: EventEmitter<any> = new EventEmitter<any>();
    constructor() {}

    ngOnInit() {}

    collectPhoto(photo){
      this.onCollect.emit(photo)
    }
    downloadPhoto(photo){
      this.onDownload.emit(photo)
    }
    likePhoto(photo){
      this.onLike.emit(photo)
    }
}

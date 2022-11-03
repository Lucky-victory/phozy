import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';

@Component({
    selector: 'app-photo-owner',
    templateUrl: './photo-owner.component.html',
    styleUrls: ['./photo-owner.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, RouterModule],
})
export class PhotoOwnerComponent implements OnInit {
    @Input() photo: PHOTO_TO_VIEW;
    @Input() color: string = '#fff';
    constructor() {}

    ngOnInit() {}
}

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule],
})
export class GalleryComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}

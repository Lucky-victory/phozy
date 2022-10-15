import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule],
})
export class BannerComponent implements OnInit {
    @Input() bannerBg: string =
        'https://images.pexels.com/photos/3494648/pexels-photo-3494648.jpeg?auto=compress&cs=tinysrgb&w=640&h=854&dpr=2';
    bg = `url(${this.bannerBg})`;
    @Input() maxHeight: string = '500px';
    constructor() {}

    ngOnInit() {}
}

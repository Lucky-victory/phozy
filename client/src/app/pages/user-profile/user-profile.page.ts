import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SegmentCustomEvent } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
    active: boolean;
    userData: any;
    userAlbums: any;
    constructor(
        private activeRoute: ActivatedRoute,
        private apiService: ApiService
    ) {}

    ngOnInit() {
        const username = this.activeRoute.snapshot.paramMap.get('username');
        this.apiService.getUserByUsername$(username).subscribe((res) => {
            this.userData = res.data 
        });
        // this.apiService.getUserCollections(username).subscribe((res) => {
        //     this.userAlbums = res.data;
        // });
    }
    segmentChanged(event:Event) {
        const ev = event as SegmentCustomEvent;
        console.log(ev.detail.value);
        
    }
}

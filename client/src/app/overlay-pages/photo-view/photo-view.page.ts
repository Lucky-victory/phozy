import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-photo-view',
    templateUrl: './photo-view.page.html',
    styleUrls: ['./photo-view.page.scss'],
})
export class PhotoViewPage implements OnInit {
    @Input() photo: any;
    constructor(
        private router: Router,
        private apiService: ApiService,
        private activeRoute: ActivatedRoute
    ) {
        // this.photo=this.router.getCurrentNavigation().extras.state?.photo;
        this.photo = this.router.getCurrentNavigation().extras.state;
    }

    ngOnInit() {
        console.log(this.router.getCurrentNavigation().extras);
        /**
         * if the photo object in the state, then query the database for it
         */

        this.activeRoute.paramMap.subscribe((params) => {
            const id = params.get('id');
            this.apiService.getPhoto(id).subscribe((response: any) => {
                this.photo = response.data;
            });
        });
    }
}

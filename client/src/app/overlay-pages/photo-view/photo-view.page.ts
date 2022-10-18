import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-photo-view',
    templateUrl: './photo-view.page.html',
    styleUrls: ['./photo-view.page.scss'],
})
export class PhotoViewPage implements OnInit, OnDestroy {
    @Input() photo: PHOTO_TO_VIEW;
    isDesktop: boolean;
    private tabletSize: number = 768;
    private resizeSub: Subscription;
    isLoaded!: boolean;
    constructor(
        private router: Router,
        private apiService: ApiService,
        private activeRoute: ActivatedRoute,
        private platform: Platform
    ) {
        this.isDesktop = this.platform.width() > this.tabletSize;
        this.photo = this.router.getCurrentNavigation().extras
            .state as PHOTO_TO_VIEW;
        this.isLoaded = typeof this.photo !== 'undefined';
        this.resizeSub = this.platform.resize
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.isDesktop = this.platform.width() > this.tabletSize;
            });
    }

    ngOnInit() {
        /**
         * if the photo object is not in the state, then query the database for it
         */
        if (!this.photo) {
            let id;
            this.activeRoute.paramMap.subscribe((params) => {
                id = params.get('id');
            });
            this.apiService.getPhoto(id).subscribe(
                (response: any) => {
                    this.photo = response.data;
                    this.isLoaded = true;
                },
                (error) => {
                    if (error.status === 404) {
                        this.router.navigate(['not-found']);
                    }
                }
            );
        }
    }
    ngOnDestroy(): void {
        this.resizeSub.unsubscribe();
    }
}

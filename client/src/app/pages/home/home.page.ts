import { UtilitiesService } from './../../services/utilities/utilities.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, DoCheck {
    photos!: PHOTO_TO_VIEW[];
    isLoggedIn!: boolean;
    currentPage = 1;
    noMoreData: boolean;
    isLoading: boolean = true;
    footerInfo: string;
    isLoaded: boolean = false;
    constructor(
        private apiService: ApiService,
        private utilitiesService: UtilitiesService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.apiService.getPhotos(this.currentPage).subscribe((response) => {
            this.isLoaded = true;
            this.photos = response.data;
        });
        this.isLoggedIn = this.authService.isLoggedIn();
    }
    onRefresh() {
        this.apiService.getPhotos(1).subscribe((response) => {
            this.isLoaded = true;
            this.photos = response.data;
        });
    }
    ngDoCheck(): void {
        // this.isLoggedIn = this.authService.isLoggedIn();
    }
    loadMore(event) {
        this.currentPage += 1;
        this.apiService.getPhotos(this.currentPage).subscribe((response) => {
            setTimeout(() => {
                console.log(response);

                event.target.complete();
                if (!response.data?.length) {
                    this.noMoreData = true;
                    event.target.disabled = true;
                }

                this.photos.push(...response.data);
            }, 500);
        });
    }
    doRefresh(event) {
        this.onRefresh();
        setTimeout(() => {
            event.target.complete();
        }, 1000);
    }
    addToCollection(photo: PHOTO_TO_VIEW) {}
    downloadPhoto(photo: PHOTO_TO_VIEW) {
        this.utilitiesService.downloadPhoto(photo);
        this.utilitiesService.$downloadComplete.subscribe((isComplete) => {
            if (isComplete) {
                alert('Thanks for downloading');
            }
        });
    }
    likeOrUnlikePhoto(photo: PHOTO_TO_VIEW) {
        if (photo.liked) {
            this.apiService.unlikePhoto(photo.id).subscribe((response: any) => {
                console.log(response, 'unlike');
                const data = response.data;
                this.reflectLikeInData(data);
            });
        } else {
            this.apiService.likePhoto(photo.id).subscribe((response: any) => {
                console.log(response, 'like');
                const data = response.data;
                this.reflectLikeInData(data);
            });
        }
    }
    reflectLikeInData(newData: PHOTO_TO_VIEW) {
        this.photos = this.photos.map((photo) => {
            newData.id === photo.id
                ? (photo.liked = newData.liked)
                : photo.liked;
            return photo;
        });
    }
    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/');
    }
}

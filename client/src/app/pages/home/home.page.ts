import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, DoCheck {
    photos!: any;
    isLoggedIn!: boolean;
    currentPage = 1;
    noMoreData: boolean;
    isLoading: boolean = true;
    footerInfo: string;
    isLoaded: boolean = false;
    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.apiService.getGeneral(this.currentPage).subscribe((response) => {
            this.isLoaded = true;
            this.photos = response.data;
        });
        this.isLoggedIn = this.authService.isLoggedIn();
    }
    loadData() {
        this.apiService.getGeneral(1).subscribe((response) => {
            this.isLoaded = true;
            this.photos = response.data;
        });
    }
    ngDoCheck(): void {
        // this.isLoggedIn = this.authService.isLoggedIn();
    }
    loadMore(event) {
        this.currentPage += 1;
        this.apiService.getGeneral(this.currentPage).subscribe((response) => {
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
        this.loadData();
        setTimeout(() => {
            event.target.complete();
        }, 2000);
    }

    likeOrUnlikePhoto(photo) {
        console.log(photo);

        if (photo.liked) {
            this.apiService.unlikePhoto(photo.id).subscribe((response: any) => {
                console.log(response, 'unlike');
                const data = response.data;
                this.photos = this.photos.map((photo) => {
                    data.id === photo.id
                        ? (photo.liked = data.liked)
                        : photo.liked;
                    return photo;
                });
            });
        } else {
            this.apiService.likePhoto(photo.id).subscribe((response: any) => {
                console.log(response, 'like');
                const data = response.data;
                this.photos = this.photos.map((photo) => {
                    data.id === photo.id
                        ? (photo.liked = data.liked)
                        : photo.liked;
                    return photo;
                });
            });
        }
    }
    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/');
    }
}

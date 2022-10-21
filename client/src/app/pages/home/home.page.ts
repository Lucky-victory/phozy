import { UtilitiesService } from './../../services/utilities/utilities.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { SignInPage } from '../sign-in/sign-in.page';
import { delay, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadPhotos } from 'src/app/state/photo/photo.actions';
import { selectAllPhotos } from 'src/app/state/photo/photo.selectors';
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
    // photos$!: Observable<PHOTO_TO_VIEW[]>;
    photos$:Observable<PHOTO_TO_VIEW[]>
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
        private router: Router, private store: Store
    ) {}

    ngOnInit() {
        // this.photos$=this.apiService.getPhotos(this.currentPage).pipe(tap(()=>this.isLoaded=true),map((response)=>response.data))
        this.store.dispatch(loadPhotos());
        this.photos$=this.store.select(selectAllPhotos)
        this.isLoggedIn = this.authService.isLoggedIn;
    }
    onRefresh() {
        this.isLoaded = false;
           this.photos$=this.apiService.getPhotos(this.currentPage).pipe(tap(()=>this.isLoaded=true),map((response)=>response.data))
    }
   
    loadMore(event) {
        this.currentPage += 1;
        this.apiService.getPhotos(this.currentPage).pipe(delay(500),tap((response) => {
            console.log(response);

            event.target.complete();
            if (!response.data?.length) {
                this.noMoreData = true;
                event.target.disabled = true;
            }
            return response
        })).subscribe()
    }
    doRefresh(event) {
        this.onRefresh();
        setTimeout(() => {
            event.target.complete();
        }, 1000);
    }
    addToCollection(photo: PHOTO_TO_VIEW) {
         if (!this.isLoggedIn) {
            this.utilitiesService.showModal({
                component: SignInPage, componentProps: {
                    isInModal:true
                }
            });
            return
        }
    }
    downloadPhoto(photo: PHOTO_TO_VIEW) {
        this.utilitiesService.downloadPhoto(photo);
        this.utilitiesService.$downloadComplete.subscribe((isComplete) => {
            if (isComplete) {
                alert('Thanks for downloading');
            }
        });
    }
    likeOrUnlikePhoto([photo, isLiked]: [PHOTO_TO_VIEW, boolean]) {
         if (!this.isLoggedIn) {
            this.utilitiesService.showModal({
                component: SignInPage, componentProps: {
                    isInModal:true
                }
            });
            return
        }
        this.utilitiesService.likeOrUnlikePhoto([photo, isLiked]).subscribe((response) => {
            this.reflectLikeInData(response.data);
      })
    }
    reflectLikeInData(newData: PHOTO_TO_VIEW) {
        this.photos$ = this.photos$.pipe(map((photos) => {
            photos.map((photo) => {
                
                newData.id === photo.id
                ? (photo.is_liked = newData.is_liked)
                : photo.is_liked;
                return photo;
            })
            return photos
        }));
    }
    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/');
    }
}

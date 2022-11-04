import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AlbumListComponent } from 'src/app/components/album-list/album-list.component';
import { SignInFormComponent } from 'src/app/components/sign-in-form/sign-in-form.component';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { USER_RESULT } from 'src/app/interfaces/user.interface';

import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { loadAlbums } from 'src/app/state/album/album.actions';
import { selectAllAlbums } from 'src/app/state/album/album.selectors';
import { AppState } from 'src/app/state/app.state';
import {
    selectIsLoggedIn,
    selectUser,
} from 'src/app/state/auth/auth.selectors';
import { likePhoto, unlikePhoto } from 'src/app/state/photo/photo.actions';

@Component({
    selector: 'app-photo-view',
    templateUrl: './photo-view.page.html',
    styleUrls: ['./photo-view.page.scss'],
})
export class PhotoViewPage implements OnInit, OnDestroy {
    @Input() photo: PHOTO_TO_VIEW;
    isDesktop: boolean;
    private tabletSize: number = 767;
    private resizeSub: Subscription;
    private loginSub: Subscription;
    isLiked!: boolean;
    isLoaded!: boolean;
    isLoggedIn!: boolean;
    likesCount: number = 0;
    user: USER_RESULT;
    userSub: Subscription;
    shareUrl:string=''
    constructor(
        private router: Router,

        private utilsService: UtilitiesService,
        private activeRoute: ActivatedRoute,
        private photoService: PhotoService,
        private platform: Platform,
        private store: Store<AppState>
    ) {
        this.isDesktop = this.platform.width() > this.tabletSize;
        this.photo = this.router.getCurrentNavigation().extras
            .state as PHOTO_TO_VIEW;
        this.isLoaded = typeof this.photo !== 'undefined';
        this.resizeSub = this.platform.resize
            .pipe(debounceTime(300))
            .subscribe(() => {
                this.isDesktop = this.platform.width() > this.tabletSize;
            });
    }
    ngOnInit() {
        this.loginSub = this.store
            .select(selectIsLoggedIn)
            .subscribe((isLoggedIn) => {
                this.isLoggedIn = isLoggedIn;
            });
        this.userSub = this.store.select(selectUser).subscribe((user) => {
            this.user = user;
        });
        this.isLiked = this.photo?.is_liked;
        this.likesCount = this.photo?.likes?.count;
        this.generateShareUrl(this.photo?.id);
        
        /**
         * if the photo object is not in router state,e.g when the url is shared,  then query the database for it,
         */
        if (!this.photo) {
            
            const id = this.activeRoute.snapshot.paramMap.get('id');
            

            this.photoService.getPhoto$(id).subscribe(
                (photo) => {
                    this.photo = photo;
                    this.isLiked = photo?.is_liked;
                    this.likesCount = photo?.likes?.count;
                    this.isLoaded = true;
                    this.generateShareUrl(photo.id)
                },
                (error) => {
                    if (error.status === 404) {
                        this.router.navigateByUrl('/not-found', {
                            skipLocationChange: true,
                        });
                    }
                }
            );
        }
    }
    private generateShareUrl(path: string) {
        const baseUrl = window.location.origin;
        this.shareUrl = `${baseUrl}/photo/${path}`;
}
    addToCollection(photo: PHOTO_TO_VIEW) {
        if (!this.isLoggedIn) {
            this.showModal();
            return;
        }
        this.store.dispatch(loadAlbums({ username: this.user.username }));
        
        this.utilsService.showModal({
            component: AlbumListComponent,
            componentProps: {
                photo: photo,
                
            },
        });
    }
    likeOrUnlikePhoto(photo: PHOTO_TO_VIEW) {
        console.log(photo);

        if (!this.isLoggedIn) {
            this.showModal();

            return;
        }
        if (this.isLiked) {
            this.likesCount -= 1;
            this.store.dispatch(unlikePhoto({ id: photo.id }));
        } else {
            this.likesCount += 1;
            this.store.dispatch(likePhoto({ id: photo.id }));
        }
        this.isLiked = !this.isLiked;
    }
    ngOnDestroy(): void {
        this.resizeSub.unsubscribe();
        this.loginSub && this.loginSub.unsubscribe();
    }
    downloadPhoto(photo: PHOTO_TO_VIEW) {
        this.utilsService.downloadPhoto(photo);
    }
    private showModal() {
        this.utilsService.showModal({
            component: SignInFormComponent,
            componentProps: {
                isInModal: true,
            },
        });
    }
}

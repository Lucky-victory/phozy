import { Component, OnDestroy, OnInit } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AlbumListComponent } from 'src/app/components/album-list/album-list.component';
import { SignInFormComponent } from 'src/app/components/sign-in-form/sign-in-form.component';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { USER_RESULT } from 'src/app/interfaces/user.interface';

import { loadAlbums } from 'src/app/state/album/album.actions';
import { selectAllAlbums } from 'src/app/state/album/album.selectors';
import { AppState } from 'src/app/state/app.state';
import { userLogout } from 'src/app/state/auth/auth.actions';
import {
    selectIsLoggedIn,
    selectUser,
} from 'src/app/state/auth/auth.selectors';
import {
    likePhoto,
    loadPaginatedPhotos,
    loadPhotos,
    unlikePhoto,
} from 'src/app/state/photo/photo.actions';
import {
    selectAllPhotos,
    selectPhotosState,
    selectPhotosStatus,
} from 'src/app/state/photo/photo.selectors';

import { UtilitiesService } from './../../services/utilities/utilities.service';
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    photos$: Observable<PHOTO_TO_VIEW[]>;
    isLoggedIn!: boolean;
    private currentPage = 1;
    noMoreData: boolean;
    isIos: boolean;
    private loadingSub: Subscription;
    private loginSub: Subscription;
    private photoStateSub: Subscription;
    isLoaded: boolean = false;
    isMobile: boolean;
    user: USER_RESULT;
    private userSub: Subscription;

    constructor(
        private utilsService: UtilitiesService,
        private platform: Platform,
        private navCtrl: NavController,

        private store: Store<AppState>
    ) {
        this.isIos = this.platform.is('ios');
        this.isMobile = this.platform.is('mobile');
    }

    ngOnInit() {
        this.userSub = this.store.select(selectUser).subscribe((user) => {
            this.user = user;
        });
        this.store.dispatch(loadPhotos());
        this.photos$ = this.store.select(selectAllPhotos);
        this.loadingSub = this.store
            .select(selectPhotosStatus)
            .subscribe((status) => {
                this.isLoaded = status === 'complete';
            });
        this.loginSub = this.store
            .select(selectIsLoggedIn)
            .subscribe((isLoggedIn) => {
                this.isLoggedIn = isLoggedIn;
            });
    }
    onRefresh() {
        this.isLoaded = false;
        this.store.dispatch(loadPhotos());
        this.loadingSub.unsubscribe();
        this.loadingSub = this.store
            .select(selectPhotosStatus)
            .subscribe((status) => {
                this.isLoaded = status === 'complete';
            });
    }

    loadMore(event) {
        this.currentPage += 1;
        this.store.dispatch(loadPaginatedPhotos({ page: this.currentPage }));

        this.photoStateSub = this.store
            .select(selectPhotosState)
            .subscribe((state) => {
                if (state.status === 'complete') event.target.complete();
                if (state.is_at_end) {
                    this.noMoreData = true;
                    event.target.disabled = true;
                }
            });
    }
    doRefresh(event) {
        this.onRefresh();
        setTimeout(() => {
            event.target.complete();
        }, 1000);
    }
    addToCollection(photo: PHOTO_TO_VIEW) {
        if (!this.isLoggedIn) {
            this.showModal();
            return;
        }

        this.store.dispatch(loadAlbums({ userId: this.user?.id }));
        const albums$ = this.store.select(selectAllAlbums);
        this.utilsService.showModal({
            component: AlbumListComponent,
            componentProps: {
                photo: photo,
                albums$,
            },
        });
    }
    downloadPhoto(photo: PHOTO_TO_VIEW) {
        this.utilsService.downloadPhoto(photo);
        this.utilsService.$downloadComplete.subscribe((isComplete) => {
            if (isComplete) {
                alert('Thanks for downloading');
            }
        });
    }

    likeOrUnlikePhoto([photo, isLiked]: [PHOTO_TO_VIEW, boolean]) {
    
        if (isLiked) {
            return this.store.dispatch(unlikePhoto({ id: photo.id }));
        }

        return this.store.dispatch(likePhoto({ id: photo.id }));
    }
    private showModal() {
        this.utilsService.showModal({
            component: SignInFormComponent,
            componentProps: {
                isInModal: true,
            },
        });
    }
    logout() {
        this.store.dispatch(userLogout());
        this.navCtrl.navigateForward('/');
    }
    ngOnDestroy(): void {
        this.loginSub && this.loginSub.unsubscribe();
        this.loadingSub && this.loadingSub.unsubscribe();
        this.photoStateSub && this.photoStateSub.unsubscribe();
        this.userSub && this.userSub.unsubscribe();
    }
}

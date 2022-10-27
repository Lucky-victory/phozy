import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { AlbumListComponent } from 'src/app/components/album-list/album-list.component';
import { SignInFormComponent } from 'src/app/components/sign-in-form/sign-in-form.component';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { loadAlbums } from 'src/app/state/album/album.actions';
import { selectAllAlbums } from 'src/app/state/album/album.selectors';
import { AppState, STATE_STATUS } from 'src/app/state/app.state';
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
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SignInPage } from '../sign-in/sign-in.page';
import { UtilitiesService } from './../../services/utilities/utilities.service';
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    // photos$!: Observable<PHOTO_TO_VIEW[]>;
    photos$: Observable<PHOTO_TO_VIEW[]>;
    isLoggedIn!: boolean;
    currentPage = 1;
    noMoreData: boolean;
    // isLoading: boolean = true;
    footerInfo: string;
    isLoaded: boolean = false;
    isLoading$!: Observable<STATE_STATUS>;
    constructor(
        private apiService: ApiService,
        private photoService: PhotoService,
        private utilsService: UtilitiesService,
        private authService: AuthService,
        private navCtrl: NavController,
        private router: Router,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        // this.photos$=this.apiService.getPhotos(this.currentPage).pipe(tap(()=>this.isLoaded=true),map((response)=>response.data))
        this.store.dispatch(loadPhotos());
        this.photos$ = this.store.select(selectAllPhotos);
        this.isLoading$ = this.store
            .select(selectPhotosStatus)
            .pipe(map((status) => status));
        this.isLoading$.subscribe((status) => {
            this.isLoaded = status !== 'pending';
        });
        this.isLoggedIn = this.authService.isLoggedIn;
    }
    onRefresh() {
        this.isLoaded = false;
    }

    loadMore(event) {
        this.currentPage += 1;
        this.store.dispatch(loadPaginatedPhotos({ page: this.currentPage }));

        this.store.select(selectPhotosState).subscribe((state) => {
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

        this.store.dispatch(loadAlbums());
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
        if (!this.isLoggedIn) {
            this.showModal();
            return;
        }
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
        this.authService.logout();
        this.navCtrl.navigateForward('/');
    }
}

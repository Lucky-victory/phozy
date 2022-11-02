import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import {
    likePhoto,
    unlikePhoto,
} from 'src/app/state/photos-by-user/photos-by-user.actions';
import {
    PHOTO_RESULT,
    PHOTO_TO_VIEW,
} from 'src/app/interfaces/photo.interface';

import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CardsComponent } from '../cards/cards.component';
import { AlbumListComponent } from '../album-list/album-list.component';
import { loadAlbums } from 'src/app/state/album/album.actions';
import { selectAllAlbums } from 'src/app/state/album/album.selectors';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { USER_RESULT } from 'src/app/interfaces/user.interface';
import {
    selectIsLoggedIn,
    selectUser,
} from 'src/app/state/auth/auth.selectors';
import { SignInFormComponent } from '../sign-in-form/sign-in-form.component';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule,
        CardsComponent,
        AlbumListComponent,
        SignInFormComponent,
    ],
})
export class GalleryComponent implements OnInit, OnDestroy {
    @Input() photos$: Observable<PHOTO_TO_VIEW[] | PHOTO_RESULT[]>;
    username: string;
    @Input() isLoaded: boolean;
    isLoggedIn: boolean;
    private currentUser: USER_RESULT;
    loginSub: Subscription;
    constructor(
        private store: Store<AppState>,
        private utilsService: UtilitiesService
    ) {}

    ngOnInit() {
        this.store.select(selectUser).subscribe((user) => {
            this.currentUser = user;
        });
        this.loginSub = this.store
            .select(selectIsLoggedIn)
            .subscribe((isLoggedIn) => {
                this.isLoggedIn = isLoggedIn;
            });
    }
    addToCollection(photo: PHOTO_TO_VIEW | PHOTO_RESULT) {
        if (!this.isLoggedIn) {
            this.showFormModal();
            return;
        }

        this.store.dispatch(
            loadAlbums({ username: this.currentUser?.username })
        );
        const albums$ = this.store.select(selectAllAlbums);
        this.utilsService.showModal({
            component: AlbumListComponent,
            componentProps: {
                photo: photo,
                albums$,
            },
        });
    }
    private showFormModal() {
        this.utilsService.showModal({
            component: SignInFormComponent,
            componentProps: {
                isInModal: true,
            },
        });
    }
    downloadPhoto(photo: PHOTO_TO_VIEW | PHOTO_RESULT) {
        this.utilsService.downloadPhoto(photo as PHOTO_TO_VIEW);
        this.utilsService.$downloadComplete.subscribe((isComplete) => {
            if (isComplete) {
                alert('Thanks for downloading');
            }
        });
    }

    likeOrUnlikePhoto([photo, isLiked]: [
        PHOTO_TO_VIEW | PHOTO_RESULT,
        boolean
    ]) {
        if (isLiked) {
            return this.store.dispatch(unlikePhoto({ id: photo.id }));
        }

        return this.store.dispatch(likePhoto({ id: photo.id }));
    }
    ngOnDestroy() {
        this.loginSub && this.loginSub.unsubscribe();
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SegmentCustomEvent } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { USER_RESULT } from 'src/app/interfaces/user.interface';
import { ApiService } from 'src/app/services/api.service';
import { AppState } from 'src/app/state/app.state';
import { loadPhotosByUser } from 'src/app/state/photo/photo.actions';
import {
    selectPhotosByUser,
    selectPhotosByUserStatus,
} from 'src/app/state/photo/photo.selectors';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
    active: boolean;
    user: USER_RESULT;
    selectedTab: string = 'gallery';
    userAlbums: any;
    isLoaded: boolean;
    photos$: Observable<PHOTO_TO_VIEW[]>;
    constructor(
        private activeRoute: ActivatedRoute,
        private apiService: ApiService,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        const username = this.activeRoute.snapshot.paramMap.get('username');
        this.apiService.getUserByUsername$(username).subscribe((res) => {
            this.user = res.data;
        });

        this.store.dispatch(loadPhotosByUser({ username: username }));
        this.store.select(selectPhotosByUserStatus).subscribe((status) => {
            this.isLoaded = status === 'complete';
        });

        this.photos$ = this.store.select(selectPhotosByUser);
    }
    segmentChanged(event: Event) {
        const ev = event as SegmentCustomEvent;
        this.selectedTab = ev.detail.value;
    }
}

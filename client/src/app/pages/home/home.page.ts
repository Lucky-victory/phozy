import { Component, OnDestroy, OnInit } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AlbumListComponent } from 'src/app/components/album-list/album-list.component';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
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

        this.store.dispatch(loadAlbums({ username: this.user?.username }));
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
    showPopover(event) {
        this.utilsService.showPopover({
            component: PopoverComponent,
            event,
            arrow: true,
        });
    }
    ngOnDestroy(): void {
        this.loginSub && this.loginSub.unsubscribe();
        this.loadingSub && this.loadingSub.unsubscribe();
        this.photoStateSub && this.photoStateSub.unsubscribe();
        this.userSub && this.userSub.unsubscribe();
    }
}

const photos = [
    {
        id: 'a668db40-c3d4-4178-baab-1f6a523bf9df',
        created_at: 1667337808400,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1667337982/phozy/a-sony-nixon-camera7915c8.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: 'A sony nixon camera',
        tags: [
            {
                title: 'camera',
            },
            {
                title: 'sony',
            },
        ],
        views: 3,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: 'd0fcdc82-5aad-4e82-a3a1-3b6b25f87bd7',
        created_at: 1667060364286,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1667060712/phozy/black-and-white-pattern7c8964.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: 'black and white pattern',
        tags: [
            {
                title: 'art',
            },
            {
                title: 'black',
            },
            {
                title: 'white',
            },
        ],
        views: 12,
        likes: {
            count: 2,
            users: [
                '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
                'ed1a60e7-583c-422f-a175-958f4737dfde',
            ],
        },
    },
    {
        id: 'af33c8e3-2345-4cd7-b43a-43671e26c1d0',
        created_at: 1666910845093,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1666951683/phozy/3d-workspace-setupa50bb6.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '3d workspace setup ',
        tags: [
            {
                title: '3d',
            },
            {
                title: 'workspace',
            },
        ],
        views: 25,
        likes: {
            count: 1,
            users: ['ed1a60e7-583c-422f-a175-958f4737dfde'],
        },
    },
    {
        id: '8369f078-39a9-4caf-ab41-991b0fc6e977',
        created_at: 1666612412601,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1666612783/phozy/redisace93e.png',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: 'Redis ',
        tags: ['db', ' dashboard', ' redis'],
        views: 18,
        likes: {
            count: 3,
            users: [
                '95d72078-07ce-4142-a768-f10ec6a111ee',
                '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
                'ed1a60e7-583c-422f-a175-958f4737dfde',
            ],
        },
    },
    {
        id: '77ef70be-8779-469c-9bf4-7f83311c20f9',
        created_at: 1666276910248,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1666285715/phozy/artsf08a13.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: 'Arts',
        tags: [],
        views: 25,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: '95dd35e3-c881-47b7-a355-0569c3a832ab',
        created_at: 1666250045519,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1666251521/phozy/funny-discord-consoledc798b.png',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: 'funny discord console',
        tags: [],
        views: 16,
        likes: {
            count: 1,
            users: ['ed1a60e7-583c-422f-a175-958f4737dfde'],
        },
    },
    {
        id: 'bdee36c3-359f-4731-b9ba-93f8cfbd6c5e',
        created_at: 1666129807896,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1666129881/phozy/my-incomplete-blogcb25be.png',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: 'My incomplete blog',
        tags: [
            {
                title: 'blog',
            },
        ],
        views: 5,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: '3286b304-c5e7-4365-909a-09105ccdff3c',
        created_at: 1666038042086,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1666038177/phozy/married-couple971701.png',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: 'married couple',
        tags: [
            {
                title: 'marriage',
            },
        ],
        views: 12,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: 'f9328e73-e63b-4c45-b70d-874c2f501592',
        created_at: 1666037779257,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1666037877/phozy/My-beautiful-Cousin5bc4b9.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: 'My beautiful Cousin',
        tags: [
            {
                title: 'vivian',
            },
            {
                title: 'stubborn',
            },
        ],
        views: 55,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: '7abd789c-2a9e-43d9-a641-961a4b0d973c',
        created_at: 1665866474876,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665866879/phozy/image_0410b35b-9375-4def-9acd-c3ad742d0909.png',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: ['cake', 'brown'],
        views: 3,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: 'a2015036-3d2b-45a3-870d-58c01503cc4b',
        created_at: 1665866474876,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665866657/phozy/image_ad0cbc68-2bc6-42b4-a73a-3a317088f46a.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 22,
        likes: {
            count: 2,
            users: [
                '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
                'ed1a60e7-583c-422f-a175-958f4737dfde',
            ],
        },
    },
    {
        id: '22be3ca8-e76f-4418-8144-cdee211e3cf2',
        created_at: 1665840533486,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665842613/phozy/image_696b2abc-a596-4451-a262-bc76c6a33bee.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: ['stella'],
        views: 3,
        likes: {
            count: 1,
            users: ['ed1a60e7-583c-422f-a175-958f4737dfde'],
        },
    },
    {
        id: 'f77f0c69-7173-4dfc-af85-2f0715604fd9',
        created_at: 1665761643893,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665761666/phozy/image_0d85c459-a2f8-4557-979d-1e720d4cf326.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [
            {
                title: 'simi',
            },
            {
                title: 'gold',
            },
        ],
        views: 5,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: '25b657df-0380-4af6-a028-ac7792939e41',
        created_at: 1665761483491,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665761513/phozy/image_06dc0741-4b4b-40f6-abb6-ee38f4130c11.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 0,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: 'efcc8b34-09b2-49c9-aec6-0053e131a145',
        created_at: 1665760703939,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665760805/phozy/image_2195ddb8-bfba-4d01-bc0b-d8e5aefbc344.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [
            {
                title: 'simi',
            },
            {
                title: 'lover',
            },
        ],
        views: 0,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: '9923571a-ea06-4358-9d3f-7d78b8baf7c3',
        created_at: 1665760213653,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665760233/phozy/image_7c99e44e-3348-4ef2-b1dc-8534fcb42634.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 1,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: 'd3c8ded4-fccb-4d2d-ba33-a4a4c5b31664',
        created_at: 1665760213653,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665760283/phozy/image_d1b50c84-c7f1-45b9-b363-cd8769646cbb.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 0,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: '986fd1a6-c850-4204-9fd5-83d695bffa0f',
        created_at: 1665760036863,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665760098/phozy/image_ba00bf9f-d729-4cb8-81a5-bf5e002f9113.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [
            {
                title: 'ini',
            },
            {
                title: 'edo',
            },
        ],
        views: 1,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: '47b81485-63d7-49f6-867f-c065ee456f7a',
        created_at: 1665748601048,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665748620/phozy/image_214c36b1-a4b4-4be1-bc67-976ff7e37835.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 4,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: '571d8bb2-40e7-4a7b-8e8a-4ff1bb58ccf8',
        created_at: 1665748601048,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665748618/phozy/image_49ed20d8-87e2-418b-9a37-bbda594a2b08.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 0,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: '024d8a69-f4d4-4eeb-9fee-ea08c4146490',
        created_at: 1665747893630,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665748496/phozy/image_6ec42b17-988a-4ba9-babe-89f604fb6671.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 9,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: '830427c7-94cf-4cdf-8d39-5a3f219d2d38',
        created_at: 1665747893630,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665748494/phozy/image_f486ff22-9db2-4a4d-88be-801ccab87bb8.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 1,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: '1d47f515-8c94-4ec9-ac77-f75312b21e37',
        created_at: 1665747378173,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665747468/phozy/image_d4d63d91-82b7-4443-ad45-b80781e710bc.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 8,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: '992243f5-02c0-4ead-ba67-9938cbec66e7',
        created_at: 1665747378173,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665747458/phozy/image_150e2e45-b686-4c09-86a2-fbcf011fb59d.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 0,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: 'b9476870-7885-4d04-a14b-d187e8f193d9',
        created_at: 1665747378173,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665747464/phozy/image_49f7ad3c-7cd0-4976-805b-916adbcafe13.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 0,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: 'dd5c5b54-0fe2-43c4-afdf-07a11228d31c',
        created_at: 1665747378173,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665747463/phozy/image_ac6a2f02-60be-4175-be7f-090fb3f280dd.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 0,
        likes: {
            count: 0,
            users: [],
        },
    },
    {
        id: '04ae2d61-14fb-4e80-9f53-87d1518137ae',
        created_at: 1665746131453,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665746271/phozy/image_f5dbad1f-ac3a-4f03-8efb-09f22fd0d11e.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: 'stella graduating',
        tags: [],
        views: 10,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: '5af2c1d5-3ac2-4471-ad7e-5b24f4668612',
        created_at: 1665746131453,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665746274/phozy/image_594a3670-5f6e-4c00-8f45-64c6ac8fea38.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: 'Lady on ankara gown and heels',
        tags: [],
        views: 6,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: 'a8253471-e40a-492c-b7d6-2db46de650c4',
        created_at: 1665746131453,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665746277/phozy/image_12cf1d82-0af0-4340-b6b6-3685e0661659.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: '',
        tags: [],
        views: 0,
        likes: {
            count: 1,
            users: ['988e5b2c-bb5e-4351-8809-7cb97bcaad10'],
        },
    },
    {
        id: 'ea71de4c-8ee6-4204-b5c1-87626ef795d3',
        created_at: 1665746131453,
        url: 'https://res.cloudinary.com/dfdoivipz/image/upload/v1665746268/phozy/image_4971160d-7d0f-4a7d-a9ac-7bf5a5ff5f69.jpg',
        user_id: '988e5b2c-bb5e-4351-8809-7cb97bcaad10',
        caption: "stella's friend",
        tags: [],
        views: 0,
        likes: {
            count: 0,
            users: [],
        },
    },
];
const photosIDS = photos.map((photo) => photo.id);
console.log(photosIDS);

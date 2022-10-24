import {
    AfterViewInit,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { debounce, debounceTime, switchMap } from 'rxjs/operators';
import { AlbumListComponent } from 'src/app/components/album-list/album-list.component';
import { CollectionListComponent } from 'src/app/components/collection-list/collection-list.component';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { SignInPage } from 'src/app/pages/sign-in/sign-in.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { loadAlbums } from 'src/app/state/album/album.actions';
import { selectAllAlbums } from 'src/app/state/album/album.selectors';
import { AppState } from 'src/app/state/app.state';
import { likePhoto, unlikePhoto } from 'src/app/state/photo/photo.actions';

@Component({
    selector: 'app-photo-view',
    templateUrl: './photo-view.page.html',
    styleUrls: ['./photo-view.page.scss'],
})
export class PhotoViewPage implements  OnDestroy {
    @Input() photo: PHOTO_TO_VIEW;
    isDesktop: boolean;
    private tabletSize: number = 768;
    private resizeSub: Subscription;
    isLiked!: boolean;
    isLoaded!: boolean;
    isLoggedIn!: boolean;
    constructor(
        private router: Router,private authService:AuthService,
        private apiService: ApiService,private utilsService:UtilitiesService,
        private activeRoute: ActivatedRoute,private photoService:PhotoService,
        private platform: Platform,private store:Store<AppState>
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
        this.isLoggedIn=this.authService.isLoggedIn
    }
ionViewWillEnter(){
    console.log('view enter');
     this.isLiked = this.photo?.is_liked;
        /**
         * if the photo object is not in router state,e.g when the url is shared,  then query the database for it,
         */
        if (!this.photo) {
            let id;
             this.activeRoute.paramMap.subscribe((params) => {
                id = params.get('id');
            });
            this.photoService.getPhoto(id).subscribe(
                (response: any) => {
                    this.photo = response.data;
                    console.log(response);
this.isLiked = this.photo?.is_liked;
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

    addToCollection(photo: PHOTO_TO_VIEW) {
         if (!this.isLoggedIn) {
            this.utilsService.showModal({
                component: SignInPage, componentProps: {
                    isInModal:true
                }
            });
            return
         }
        this.store.dispatch(loadAlbums());
        const albums$ = this.store.select(selectAllAlbums);
        this.utilsService.showModal({
            component: AlbumListComponent, componentProps: {
             photo:photo,albums$
         }
     })
 }
    likeOrUnlikePhoto(photo: PHOTO_TO_VIEW) {
        console.log(photo);
        
        if (!this.isLoggedIn) {
          
            this.utilsService.showModal({
                component:SignInPage, componentProps: {
                    isInModal:true
                }
            });
            
            
            return
        }
        if (this.isLiked) {
            this.store.dispatch(unlikePhoto({id:photo.id}))
            
        }
        else {
            
            this.store.dispatch(likePhoto({id:photo.id}))
        }
       this.isLiked=!this.isLiked
   }
    ngOnDestroy(): void {
        this.resizeSub.unsubscribe();
    }
    downloadPhoto(photo:PHOTO_TO_VIEW) {
        this.utilsService.downloadPhoto(photo)
    }
}

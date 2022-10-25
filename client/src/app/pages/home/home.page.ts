import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { AlbumListComponent } from 'src/app/components/album-list/album-list.component';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { loadAlbums } from 'src/app/state/album/album.actions';
import { selectAllAlbums } from 'src/app/state/album/album.selectors';
import { AppState, STATE_STATUS } from 'src/app/state/app.state';
import { likePhoto, loadPhotos, unlikePhoto } from 'src/app/state/photo/photo.actions';
import { selectAllPhotos, selectPhotosStatus } from 'src/app/state/photo/photo.selectors';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SignInPage } from '../sign-in/sign-in.page';
import { UtilitiesService } from './../../services/utilities/utilities.service';
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
    // isLoading: boolean = true;
    footerInfo: string;
    isLoaded: boolean = false;
    isLoading$!: Observable<STATE_STATUS>;
    constructor(
        private apiService: ApiService,private photoService:PhotoService,
        private utilsService: UtilitiesService,
        private authService: AuthService,private navCtrl:NavController,
        private router: Router, private store: Store<AppState>
    ) {}

    ngOnInit() {
        // this.photos$=this.apiService.getPhotos(this.currentPage).pipe(tap(()=>this.isLoaded=true),map((response)=>response.data))
        this.store.dispatch(loadPhotos());
        this.photos$ = this.store.select(selectAllPhotos);
        this.isLoading$ = this.store.select(selectPhotosStatus).pipe(map(status => status));
       this.isLoading$.subscribe((status) => {
            this.isLoaded=status==='complete'
        })
        this.isLoggedIn = this.authService.isLoggedIn;
    }
    onRefresh() {
        this.isLoaded = false;
        //    this.photos$=this.photoService.getAll$(this.currentPage).pipe(tap(()=>this.isLoaded=true),map((response)=>response.data))
    }
   
    loadMore(event) {
        this.currentPage += 1;
        this.photoService.getAll$(this.currentPage).pipe(delay(500),tap((response) => {
            console.log(response);

            // event.target.complete();
            // if (!response.data?.length) {
            //     this.noMoreData = true;
            //     event.target.disabled = true;
            // }
            // return response
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
    downloadPhoto(photo: PHOTO_TO_VIEW) {
        this.utilsService.downloadPhoto(photo);
        this.utilsService.$downloadComplete.subscribe((isComplete) => {
            if (isComplete) {
                alert('Thanks for downloading');
            }
        });
    }

    likeOrUnlikePhoto([photo,isLiked]:[PHOTO_TO_VIEW,boolean]) {
        if (isLiked) {
            return this.store.dispatch(unlikePhoto({ id: photo.id }))
        } 
            
        return this.store.dispatch(likePhoto({ id: photo.id }))
     }
   
    logout() {
        this.authService.logout();
        this.navCtrl.navigateForward('/')
    }
}

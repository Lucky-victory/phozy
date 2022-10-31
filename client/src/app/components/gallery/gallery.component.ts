import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { loadPhotosByUser } from 'src/app/state/photo/photo.actions';
import {
    PHOTO_RESULT,
    PHOTO_TO_VIEW,
} from 'src/app/interfaces/photo.interface';
import {
    selectPhotosByUser,
    selectPhotosByUserStatus,
} from 'src/app/state/photo/photo.selectors';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CardsComponent } from '../cards/cards.component';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, CardsComponent],
})
export class GalleryComponent implements OnInit {
    @Input() photos$: Observable<PHOTO_TO_VIEW[]>;
    username: string;
    @Input() isLoaded: boolean;
    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // const username = this.route.snapshot.paramMap.get('username');
        // this.store.dispatch(loadPhotosByUser({ username: username }));
        // this.store.select(selectPhotosByUserStatus).subscribe((status) => {
        //     this.isLoaded = status === 'complete';
        // });
        // this.photos$ = this.store.select(selectPhotosByUser);
    }
}

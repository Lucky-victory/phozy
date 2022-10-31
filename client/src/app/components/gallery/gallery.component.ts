import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { loadPhotosByUser } from 'src/app/state/photo/photo.actions';
import { PHOTO_RESULT } from 'src/app/interfaces/photo.interface';
import { selectPhotosByUser } from 'src/app/state/photo/photo.selectors';
import { Observable } from 'rxjs';
import { selectUser } from 'src/app/state/auth/auth.selectors';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule],
})
export class GalleryComponent implements OnInit {
    photos$: Observable<PHOTO_RESULT[]>;
    username: string;
    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ) {}

    async ngOnInit() {
        const username = this.route.snapshot.paramMap.get('username');
        this.store.dispatch(loadPhotosByUser({ username: username }));
        this.photos$ = this.store.select(selectPhotosByUser);
    }
}

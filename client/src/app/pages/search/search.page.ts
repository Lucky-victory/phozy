import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PHOTO_RESULT } from 'src/app/interfaces/photo.interface';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { AppState } from 'src/app/state/app.state';
import { photoSearch } from 'src/app/state/photo-search/photo-search.actions';
import {
    selectPhotoSearch,
    selectPhotoSearchStatus,
} from 'src/app/state/photo-search/photo-search.selectors';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    query: string;
    photos$: Observable<PHOTO_RESULT[]>;
    isLoaded: boolean;

    constructor(
        private activeRoute: ActivatedRoute,

        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.query = this.activeRoute.snapshot.paramMap.get('query');
        this.search(this.query);
    }
    search(query: string) {
        this.query = query;
        this.store.dispatch(photoSearch({ query }));
        this.photos$ = this.store.select(selectPhotoSearch);
        this.store.select(selectPhotoSearchStatus).subscribe((status) => {
            this.isLoaded = status === 'complete';
        });
    }
}

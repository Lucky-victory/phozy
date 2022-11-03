import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
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
export class SearchPage implements OnInit ,OnDestroy{
    query: string;
    photos$ = this.store.select(selectPhotoSearch);
    isLoaded: boolean;
    loadingSub: Subscription;
    constructor(
        private activeRoute: ActivatedRoute,

        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.query = this.activeRoute.snapshot.paramMap.get('query');
        this.search(this.query);
        this.store.select(selectPhotoSearchStatus).subscribe((status) => {
            this.isLoaded = status !== 'pending';
        });
    }
    search(query: string) {
        this.query = query;
        this.store.dispatch(photoSearch({ query }));
    }
    ngOnDestroy(): void {
        this.loadingSub?.unsubscribe()
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PHOTO_RESULT } from 'src/app/interfaces/photo.interface';
import { PhotoService } from 'src/app/services/photo/photo.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    query: string;
    photos$: Observable<PHOTO_RESULT[]>;
    constructor(
        private activeRoute: ActivatedRoute,
        private photoService: PhotoService
    ) {}

    ngOnInit() {
        this.query = this.activeRoute.snapshot.paramMap.get('query');
        this.search(this.query);
    }
    search(query: string) {
        this.query = query;
        this.photos$ = this.photoService.search$(query);
        console.log(query, 'in search page');
    }
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IResponseResult } from '../interfaces/common';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private apiBaseUrl: string = environment.apiBaseUrl;

    constructor(private http: HttpClient, private router: Router) {}
    getUserAlbums(username: string) {
        return this.http
            .get<IResponseResult>(
                `${this.apiBaseUrl}/profile/${username}/albums`
            )
            .pipe(catchError(this.errorHandler));
    }

    getGeneral(page: number = 1, perPage = 10) {
        return this.http
            .get(`${this.apiBaseUrl}/photos?page=${page}&perPage=${perPage}`)
            .pipe(catchError(this.errorHandler)) as any;
    }
    errorHandler(error: HttpErrorResponse) {
        return throwError(error || '');
    }
    uploadPhotos(photos: any[]) {
        const formdata = new FormData();
        photos = photos.map((photo) => {
            delete photo?.id;
            return photo;
        });
        for (const photo of photos) {
            formdata.append('photos', photo.image);
            // formdata.append('tags', photo.tags);
        }
        formdata.append('all', JSON.stringify(photos));

        return this.http
            .post(`${this.apiBaseUrl}/photos`, formdata)
            .pipe(catchError(this.errorHandler));
    }
    createNewAlbum(title: string, description?: string, privacy?: boolean) {
        return this.http
            .post(`${this.apiBaseUrl}/albums`, { title, description, privacy })
            .pipe(catchError(this.errorHandler));
    }
    likePhoto(photoId: number) {
        return this.http
            .put(`${this.apiBaseUrl}/photos/${photoId}/like`, {})
            .pipe(catchError(this.errorHandler));
    }

    unlikePhoto(photoId: number) {
        return this.http
            .post(`${this.apiBaseUrl}/likes/unlike/${photoId}`, {})
            .pipe(catchError(this.errorHandler));
    }

    getUserData(username: string) {
        return this.http
            .get<IResponseResult>(`${this.apiBaseUrl}/profile/${username}`)
            .pipe(catchError(this.errorHandler));
    }
}

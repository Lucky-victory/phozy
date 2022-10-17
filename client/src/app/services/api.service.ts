import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, retry, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IResponseResult } from '../interfaces/common';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private apiBaseUrl: string = environment.apiBaseUrl;
    private retryCount: number = 3;
    private retryDelay: number = 3000;
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
            .get(`${this.apiBaseUrl}/photos`, { params: { page, perPage } })
            .pipe(
                retry(this.retryCount),
                delay(this.retryDelay),
                catchError(this.errorHandler)
            ) as any;
    }
    private errorHandler(error: HttpErrorResponse) {
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
            .pipe(
                retry(this.retryCount),
                delay(this.retryDelay),
                catchError(this.errorHandler)
            );
    }
    createNewAlbum(title: string, description?: string, privacy?: boolean) {
        return this.http
            .post(`${this.apiBaseUrl}/albums`, { title, description, privacy })
            .pipe(catchError(this.errorHandler));
    }
    likePhoto(photoId: string) {
        return this.http
            .post(`${this.apiBaseUrl}/photos/${photoId}/like`, {})
            .pipe(catchError(this.errorHandler));
    }
    getPhoto(photoId: string) {
        return this.http
            .get(`${this.apiBaseUrl}/photos/${photoId}`,)
            .pipe(
                retry(this.retryCount),
                delay(this.retryDelay),
                catchError(this.errorHandler)
            );
    }

    unlikePhoto(photoId: string) {
        return this.http
            .post(`${this.apiBaseUrl}/photos/${photoId}/unlike`, {})
            .pipe(catchError(this.errorHandler));
    }

    getUserData(username: string) {
        return this.http
            .get<IResponseResult>(`${this.apiBaseUrl}/profile/${username}`)
            .pipe(catchError(this.errorHandler));
    }
}

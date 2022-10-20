import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, retry, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import {
    PHOTO_FROM_CLIENT,
    PHOTO_TO_VIEW,
    QUERY_RESPONSE,
} from '../interfaces/photo.interface';
import { USER_RESULT } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    protected apiBaseUrl: string = environment.apiBaseUrl;
    protected retryCount: number = 3;
    protected retryDelay: number = 3000;
    constructor(protected http: HttpClient) {}
    getUserCollections(username: string) {
        return this.http
            .get<QUERY_RESPONSE>(
                `${this.apiBaseUrl}/profile/${username}/albums`
            )
            .pipe(catchError(this.errorHandler));
    }

    getPhotos(page: number = 1, perPage = 10) {
        return this.http
            .get<QUERY_RESPONSE<PHOTO_TO_VIEW[]>>(`${this.apiBaseUrl}/photos`, { params: { page, perPage } })
            .pipe(
                retry(this.retryCount),
                delay(this.retryDelay),
                catchError(this.errorHandler)
            ) ;
    }
    protected errorHandler(error: HttpErrorResponse) {
        return throwError(error || '');
    }
    uploadPhotos(photos: PHOTO_FROM_CLIENT[]) {
        const formdata = new FormData();
        photos = photos.map((photo) => {
            delete photo?.id;
            return photo;
        });
        for (const photo of photos) {
            formdata.append('photos', photo.image);
        }
        formdata.append(
            'all',
            JSON.stringify(
                photos.map((photo) => {
                    delete photo?.image;
                    return photo;
                })
            )
        );

        return this.http
            .post(`${this.apiBaseUrl}/photos`, formdata)
            .pipe(
                retry(this.retryCount),
                delay(this.retryDelay),
                catchError(this.errorHandler)
            );
    }
    createNewCollection(
        title: string,
        description?: string,
        is_public?: boolean
    ) {
        return this.http
            .post(`${this.apiBaseUrl}/albums`, {
                title,
                description,
                is_public,
            })
            .pipe(catchError(this.errorHandler));
    }
    addToCollection(photo: PHOTO_TO_VIEW) {
        this.http.post(`${this.apiBaseUrl}/albums`, {});
    }
    likePhoto(photoId: string) {
        return this.http
            .post<QUERY_RESPONSE<PHOTO_TO_VIEW>>(`${this.apiBaseUrl}/photos/${photoId}/like`, {})
            .pipe(catchError(this.errorHandler));
    }
    getPhoto(photoId: string) {
        return this.http
            .get(`${this.apiBaseUrl}/photos/${photoId}`)
            .pipe(
                retry(this.retryCount),
                delay(this.retryDelay),
                catchError(this.errorHandler)
            );
    }

    unlikePhoto(photoId: string) {
        return this.http
            .post<QUERY_RESPONSE<PHOTO_TO_VIEW>>(`${this.apiBaseUrl}/photos/${photoId}/unlike`, {})
            .pipe(catchError(this.errorHandler));
    }

    getUserData(username: string) {
        return this.http
            .get<QUERY_RESPONSE<USER_RESULT>>(`${this.apiBaseUrl}/profile/${username}`)
            .pipe(catchError(this.errorHandler));
    }
}

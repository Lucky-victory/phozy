import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ALBUM_RESULT, NEW_ALBUM } from '../interfaces/album.interface';

import {
    PHOTO_FROM_CLIENT, QUERY_RESPONSE
} from '../interfaces/photo.interface';
import { USER_RESULT } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    protected apiBaseUrl: string = environment.apiBaseUrl;
    protected retryCount: number = 2;
    protected retryDelay: number = 5000;
    constructor(protected http: HttpClient) { }
    getUserAlbums$(username: string) {
        return this.http
            .get<QUERY_RESPONSE>(
                `${this.apiBaseUrl}/profile/${username}/albums`
            )
            .pipe(catchError(this.errorHandler));
    }

    protected errorHandler(error: HttpErrorResponse) {
        return throwError(error || '');
    }
    uploadPhotos$(photos: PHOTO_FROM_CLIENT[]) {
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
                catchError(this.errorHandler)
            );
    }
    createAlbum$({ 
        title,
        description,
        is_public
    }:NEW_ALBUM) {
        return this.http
            .post<QUERY_RESPONSE<ALBUM_RESULT>>(`${this.apiBaseUrl}/albums`, {
                title,
                description,
                is_public,
            })
            .pipe(map((response)=>response.data),catchError(this.errorHandler));
    }
    addPhotoToAlbum$(albumId:string,photoId:string) {
        return this.http.put<QUERY_RESPONSE<ALBUM_RESULT>>(`${this.apiBaseUrl}/albums/${albumId}/photo`, {photo_id:photoId}).pipe(map((response)=>response.data));
    }
   

    getUserByUsername$(username: string) {
        return this.http
            .get<QUERY_RESPONSE<USER_RESULT>>(`${this.apiBaseUrl}/profile/${username}`)
            .pipe(catchError(this.errorHandler));
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry,delay, map } from 'rxjs/operators';
import { PHOTO_TO_VIEW, QUERY_RESPONSE } from 'src/app/interfaces/photo.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService extends ApiService{

  constructor( http: HttpClient) { 
    super(http)
  }
     getAll$(page: number = 1, perPage = 10) {
        return this.http
            .get<QUERY_RESPONSE<PHOTO_TO_VIEW[]>>(`${this.apiBaseUrl}/photos`, { params: { page, perPage } })
            .pipe(
                retry(this.retryCount),
              delay(this.retryDelay),
              map((response)=>response.data),
              catchError(this.errorHandler),
            ) ;
     }
   likePhoto(photoId: string) {
        return this.http
            .post<QUERY_RESPONSE<PHOTO_TO_VIEW>>(`${this.apiBaseUrl}/photos/${photoId}/like`, {})
            .pipe(map((response)=>response.data),catchError(this.errorHandler));
    }
    getPhoto$(photoId: string) {
        return this.http
            .get<QUERY_RESPONSE<PHOTO_TO_VIEW>>(`${this.apiBaseUrl}/photos/${photoId}`)
            .pipe(
                map((response)=>response.data),
                catchError(this.errorHandler)
            );
    }

    unlikePhoto(photoId: string) {
        return this.http
            .post<QUERY_RESPONSE<PHOTO_TO_VIEW>>(`${this.apiBaseUrl}/photos/${photoId}/unlike`, {})
            .pipe(map((response)=>response.data),catchError(this.errorHandler));
    }
}

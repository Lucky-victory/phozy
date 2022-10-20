import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, retry,map } from 'rxjs/operators';
import { ALBUM_RESULT } from 'src/app/interfaces/albums.interface';
import { QUERY_RESPONSE } from 'src/app/interfaces/photo.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumService extends ApiService{

 constructor(http:HttpClient) { 
    super(http)
  }
  getAll$(page: number = 1, perPage = 10) {
        return this.http
            .get<QUERY_RESPONSE<ALBUM_RESULT[]>>(`${this.apiBaseUrl}/albums`, { params: { page, perPage } })
            .pipe(
                retry(this.retryCount),
              delay(this.retryDelay),
                map((response)=>response.data),
                catchError(this.errorHandler)
            ) ;
    
}
}

import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PHOTO_TO_VIEW } from '../../interfaces/photo.interface';
import { ApiService } from '../api.service';
@Injectable({
    providedIn: 'root',
})
export class UtilitiesService {
    private downloadComplete = new BehaviorSubject<boolean>(false);
    $downloadComplete = this.downloadComplete.asObservable().pipe(delay(2500));
    constructor(private apiService:ApiService) {}

    downloadPhoto(photo: PHOTO_TO_VIEW) {
        const urlSegments = photo.url.split('.');
        const ext = urlSegments[urlSegments.length - 1];

        saveAs(photo.url, `phozy_${photo.id}.${ext}`);
        this.downloadComplete.next(true);
    }
     likeOrUnlikePhoto([photo,isLiked]:[PHOTO_TO_VIEW,boolean]) {
        if (isLiked) {
            return this.apiService.unlikePhoto(photo.id);
        } 
            
         return this.apiService.likePhoto(photo.id)
     }
    
    
}

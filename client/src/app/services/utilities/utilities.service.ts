import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PHOTO_TO_VIEW } from '../../interfaces/photo.interface';
@Injectable({
    providedIn: 'root',
})
export class UtilitiesService {
    private downloadComplete = new BehaviorSubject<boolean>(false);
    $downloadComplete = this.downloadComplete.asObservable().pipe(delay(2500));
    constructor() {}

    downloadPhoto(photo: PHOTO_TO_VIEW) {
        const urlSegments = photo.url.split('.');
        const ext = urlSegments[urlSegments.length - 1];

        saveAs(photo.url, `phozy_${photo.id}.${ext}`);
        this.downloadComplete.next(true);
    }
}

import { Injectable } from '@angular/core';
import { ModalController, ModalOptions, ToastButton, ToastController, ToastOptions } from '@ionic/angular';
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

    constructor(private apiService:ApiService,private modalCtrl:ModalController,private toastCtrl:ToastController) {}

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
    
    async showModal(options: ModalOptions) {
        const defOpts = {
            initialBreakpoint:0.75,breakpoints:[0,0.75,1]
        }
       const opts=Object.assign({},options,defOpts)
        const modal = await this.modalCtrl.create(opts);
       await modal.present();
    }
    async showToast(options: ToastOptions)
    {
        const defBtn: ToastButton = {
            text: 'Okay',
            side: 'end',
            role: 'cancel'
        };
        if (Array.isArray(options.buttons)) {
            options.buttons.push(defBtn)
        } else {
            options.buttons=[defBtn]
        }
        const defOpts = {
            position: 'top',duration:3000
        }
        const opts=Object.assign({},defOpts,options)
        const toast = await this.toastCtrl.create(opts);
       await toast.present();
    }
}

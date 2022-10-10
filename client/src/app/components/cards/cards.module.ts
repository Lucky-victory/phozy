import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardsComponent } from './cards.component';
import { IonicModule } from '@ionic/angular';
import { PhotoModalModule } from '../photo-modal/photo-modal.module';
import { NotifToastModule } from '../notif-toast/notif-toast.module';



@NgModule({
  declarations: [CardsComponent],
  imports: [
    CommonModule,IonicModule,PhotoModalModule,NotifToastModule
  ],
  exports:[CardsComponent]
})
export class CardsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NotifToastComponent } from './notif-toast.component';



@NgModule({
  declarations: [NotifToastComponent],
  imports: [
    CommonModule,IonicModule
  ],
  exports:[NotifToastComponent]
})
export class NotifToastModule { }

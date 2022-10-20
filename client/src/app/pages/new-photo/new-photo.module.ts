import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPhotoPageRoutingModule } from './new-photo-routing.module';

import { NewPhotoPage } from './new-photo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,ReactiveFormsModule,
    NewPhotoPageRoutingModule,
  ],
  declarations: [NewPhotoPage],
})
export class NewPhotoPageModule {}

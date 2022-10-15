import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoViewPageRoutingModule } from './photo-view-routing.module';

import { PhotoViewPage } from './photo-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoViewPageRoutingModule
  ],
  declarations: [PhotoViewPage]
})
export class PhotoViewPageModule {}

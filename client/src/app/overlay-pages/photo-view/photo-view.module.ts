import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoViewPageRoutingModule } from './photo-view-routing.module';

import { PhotoViewPage } from './photo-view.page';
import { SignInPageModule } from 'src/app/pages/sign-in/sign-in.module';
import { CollectionListComponent } from 'src/app/components/collection-list/collection-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoViewPageRoutingModule,SignInPageModule,CollectionListComponent
  ],
  declarations: [PhotoViewPage]
})
export class PhotoViewPageModule {}

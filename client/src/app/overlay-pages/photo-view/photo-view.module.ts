import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoViewPageRoutingModule } from './photo-view-routing.module';

import { PhotoViewPage } from './photo-view.page';

import { SignInFormComponent } from 'src/app/components/sign-in-form/sign-in-form.component';
import { PhotoOwnerComponent } from 'src/app/components/photo-owner/photo-owner.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PhotoViewPageRoutingModule,
        SignInFormComponent,
        PhotoOwnerComponent,
    ],
    declarations: [PhotoViewPage],
})
export class PhotoViewPageModule {}

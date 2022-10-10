import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignInPageRoutingModule } from './sign-in-routing.module';

import { AuthService } from 'src/app/services/auth.service';;
import { SignInPage } from './sign-in.page';
import { NotifToastModule } from 'src/app/components/notif-toast/notif-toast.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,ReactiveFormsModule,NotifToastModule,
    SignInPageRoutingModule,],
  declarations: [SignInPage],providers:[AuthService]
})
export class SignInPageModule {}

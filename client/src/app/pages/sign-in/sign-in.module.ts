import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SignInFormComponent } from 'src/app/components/sign-in-form/sign-in-form.component';

import { SignInPageRoutingModule } from './sign-in-routing.module';

import { SignInPage } from './sign-in.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        SignInPageRoutingModule,
        SignInFormComponent,
    ],
    declarations: [SignInPage],
})
export class SignInPageModule {}

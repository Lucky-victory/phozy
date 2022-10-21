import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardsComponent } from './../../components/cards/cards.component';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { BannerComponent } from 'src/app/components/banner/banner.component';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

import { EffectsModule } from '@ngrx/effects';
import { PhotoEffects } from '../../state/photo/photo.effects';
import { SignInPageModule } from '../sign-in/sign-in.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        CardsComponent,
        FooterModule,
        BannerComponent,SignInPageModule, 
    ],
    declarations: [HomePage],
    providers: [ApiService, AuthService],
    exports: [HomePage],
})
export class HomePageModule {}

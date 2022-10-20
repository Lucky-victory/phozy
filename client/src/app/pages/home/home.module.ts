import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './../../components/cards/cards.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { BannerComponent } from 'src/app/components/banner/banner.component';

import { SignInPageModule } from '../sign-in/sign-in.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        CardsComponent,
        FooterModule,
        BannerComponent,SignInPageModule
    ],
    declarations: [HomePage],
    providers: [ApiService, AuthService],
    exports: [HomePage],
})
export class HomePageModule {}

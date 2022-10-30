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

import { SignInPageModule } from '../sign-in/sign-in.module';
import { AlbumListComponent } from 'src/app/components/album-list/album-list.component';
import { SignInFormComponent } from 'src/app/components/sign-in-form/sign-in-form.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        CardsComponent,
        AlbumListComponent,
        FooterModule,
        BannerComponent,
        SignInPageModule,
        SignInFormComponent,
    ],
    declarations: [HomePage],
    exports: [HomePage],
})
export class HomePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { CardsModule } from 'src/app/components/cards/cards.module';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FooterModule } from 'src/app/components/footer/footer.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,CardsModule,FooterModule
  ],
  declarations: [HomePage],providers:[ApiService,AuthService],exports:[HomePage]
})
export class HomePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';
import { CardsComponent } from 'src/app/components/cards/cards.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SearchPageRoutingModule,
        SearchBarComponent,
        CardsComponent,
    ],
    declarations: [SearchPage],
})
export class SearchPageModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppEffects } from './app.effects';
import { metaReducers, reducers } from './reducers';
import { AuthInterceptorService } from './services/auth-interceptor/auth-interceptor.service';
import { PhotoEffects } from './state/photo/photo.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,ReactiveFormsModule, StoreModule.forRoot(reducers, { metaReducers, }), !environment.production ? StoreDevtoolsModule.instrument() : [], EffectsModule.forRoot([AppEffects,PhotoEffects])],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, {provide:HTTP_INTERCEPTORS,useClass: AuthInterceptorService ,multi:true},],
  bootstrap: [AppComponent],
})
export class AppModule {}

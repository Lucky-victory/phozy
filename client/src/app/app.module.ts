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

import { metaReducers, reducers } from './reducers';
import { AuthInterceptorService } from './services/auth-interceptor/auth-interceptor.service';
import { PhotoEffects } from './state/photo/photo.effects';
import { AlbumEffects } from './state/album/album.effects';
import { AuthEffects } from './state/auth/auth.effects';
import { PhotosByUserEffects } from './state/photos-by-user/photos-by-user.effects';
import { AlbumsByUserEffects } from './state/albums-by-user/albums-by-user.effects';
import { PhotoSearchEffects } from './state/photo-search/photo-search.effects';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        EffectsModule.forRoot([PhotoEffects, AlbumEffects, AuthEffects]),
        EffectsModule.forFeature([
            PhotosByUserEffects,
            AlbumsByUserEffects,
            PhotoSearchEffects,
        ]),
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

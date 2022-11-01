import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppState } from 'src/app/state/app.state';
import { selectUser } from 'src/app/state/auth/auth.selectors';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private store: Store<AppState>,
        private navCtrl: NavController
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.store.select(selectUser).pipe(
            tap((user) => {
                if (!user) this.navCtrl.navigateForward('/');
            }),
            map((user) => {
                return true;
            })
        );
    }
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, timer } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from '../app.state';
import {
    userAuthFailure,
    userAuthSuccess,
    userLogout,
    userSignIn,
    userSignUp,
} from './auth.actions';
import { selectAuthTokenExpiration } from './auth.selectors';

@Injectable()
export class AuthEffects {
    tokenExpiration$ = this.store.select(selectAuthTokenExpiration);

    signIn$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userSignIn),
            switchMap((details) =>
                this.authService
                    .signIn(details.email_or_username, details.password)
                    .pipe(
                        map((result) => userAuthSuccess(result)),
                        catchError(() =>
                            of(
                                userAuthFailure({
                                    error: "Couldn't sign up, Try again",
                                })
                            )
                        )
                    )
            )
        )
    );
    signUp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userSignUp),
            switchMap((details) =>
                this.authService.signUp(details).pipe(
                    map((result) => userAuthSuccess(result)),
                    catchError(() =>
                        of(
                            userAuthFailure({
                                error: "Couldn't sign in, Try again",
                            })
                        )
                    )
                )
            )
        )
    );
    logout$ = createEffect(
        () =>
            this.actions$.pipe(
                switchMap(() =>
                    this.tokenExpiration$.pipe(
                        concatMap((time) =>
                            timer(time).pipe(
                                map(() => this.authService.logout())
                            )
                        )
                    )
                )
            ),
        { dispatch: false }
    );

    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private authService: AuthService
    ) {}
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { userAuthFailure, userAuthSuccess, userSignIn } from './auth.actions';

@Injectable()
export class AuthEffects {
    signIn$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userSignIn),
            switchMap((details) =>
                this.authService
                    .signIn(details.email_or_username, details.password)
                    .pipe(
                        map((result) => {
                            console.log('in sigin pipe');

                            return userAuthSuccess({
                                user: result.user,
                                auth: result.auth,
                            });
                        })
                    )
            )
        )
    );

    constructor(private actions$: Actions, private authService: AuthService) {}
}

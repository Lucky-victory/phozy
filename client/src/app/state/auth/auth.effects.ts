import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { userAuthSuccess, userSignIn } from './auth.actions';



@Injectable()
export class AuthEffects {
signIn$=this.actions$.pipe(ofType(userSignIn),switchMap((details)=>this.authService.signIn(details.email_or_username,details.password)),map((result)=>userAuthSuccess({user:result.user,auth:result.auth})))

  constructor(private actions$: Actions,private authService:AuthService) {}
}

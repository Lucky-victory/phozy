import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { AuthService } from 'src/app/services/auth.service';



@Injectable()
export class AuthEffects {


  constructor(private actions$: Actions,private authService:AuthService) {}
}

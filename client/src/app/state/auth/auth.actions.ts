import { createAction, props } from '@ngrx/store';
import { USER_RESULT } from 'src/app/interfaces/user.interface';

export const userAuths = createAction(
  '[Auth] User Auths'
);
export const userSignIn=createAction('[Auth] User Sign In',props<{email_or_username:string,password:string}>())
export const userSignUp = createAction('[Auth] User Sign Up', props<{ fullname: string; email:string,password:string}>())
export const userLogout = createAction('[Auth] User Logout',)
export const userAuthsSuccess = createAction(
  '[Auth] User Auths Success',
  props<{ user:USER_RESULT}>()
);

export const userAuthsFailure = createAction(
  '[Auth] User Auths Failure',
  props<{ error: string }>()
);

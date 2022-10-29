import { createAction, props } from '@ngrx/store';
import { AUTH_TOKEN, USER_RESULT } from 'src/app/interfaces/user.interface';

export const userSignIn = createAction(
    '[Auth] User Sign In',
    props<{ email_or_username: string; password: string }>()
);
export const userSignUp = createAction(
    '[Auth] User Sign Up',
    props<{ fullname: string; email: string; password: string }>()
);

export const userLogout = createAction('[Auth] User Logout');
export const userAuthSuccess = createAction(
    '[Auth] User Auths Success',
    props<{ user: USER_RESULT; auth: AUTH_TOKEN }>()
);

export const userAuthFailure = createAction(
    '[Auth] User Auths Failure',
    props<{ error: string }>()
);

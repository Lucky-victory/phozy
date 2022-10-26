import { createReducer, on } from '@ngrx/store';
import { AUTH_TOKEN, USER_RESULT } from 'src/app/interfaces/user.interface';
import { STATE_STATUS } from '../app.state';
import { userAuthFailure, userAuthSuccess, userLogout, userSignIn, userSignUp } from './auth.actions';


export const authFeatureKey = 'auth';

export interface UserState {
user?:USER_RESULT,status:STATE_STATUS,auth?:AUTH_TOKEN
}

export const initialState: UserState = {
user:undefined,
 status:'pending',auth:undefined
};

export const authReducer = createReducer(
  initialState,
  on(userLogout, (state) => ({ ...state })), on(userSignIn, (state) => ({ ...state,status:'pending' })), on(userSignUp, (state) => ({ ...state })), on(userAuthSuccess, (state, { user,auth }) => ({ ...state, status: 'complete', user: user,auth })),on(userAuthFailure, (state, ) => ({ ...state, status: 'error',}))
  );

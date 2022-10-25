import { Action, createReducer, on, } from '@ngrx/store';
import { USER_RESULT } from 'src/app/interfaces/user.interface';
import { STATE_STATUS } from '../app.state';
import { userAuthsFailure, userAuthsSuccess, userLogout, userSignIn, userSignUp } from './auth.actions';


export const authFeatureKey = 'auth';

export interface UserState {
user:USER_RESULT,status:STATE_STATUS
}

export const initialState: UserState = {
user:{fullname:'',id:'',profile_image:'',username:''},
 status:'pending'
};

export const reducer = createReducer(
  initialState,
  on(userLogout, (state) => ({ ...state })), on(userSignIn, (state) => ({ ...state })), on(userSignUp, (state) => ({ ...state })), on(userAuthsSuccess, (state, { user }) => ({ ...state, status: 'complete', user: user })),on(userAuthsFailure, (state, ) => ({ ...state, status: 'error',}))
  );

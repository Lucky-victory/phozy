import { createReducer, on } from '@ngrx/store';
import { STORAGE_KEYS } from 'src/app/interfaces/common';
import { AUTH_TOKEN, USER_RESULT } from 'src/app/interfaces/user.interface';
import { STATE_STATUS } from '../app.state';
import {
    userAuthFailure,
    userAuthSuccess,
    userLogout,
    userSignIn,
    userSignUp,
} from './auth.actions';

export const authFeatureKey = 'auth';
const initialTokenExpirationTime = parseInt(
    localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRATION_TIME) || '0'
);
/**
 * Check if the token exipiration saved as time is lesser than current time
 */
const isBehindTime =
    new Date().getTime() > new Date(initialTokenExpirationTime).getTime();
const initialTokenExpiration = parseInt(
    localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRATION) || '0'
);
const savedUser = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.USER)
) as USER_RESULT;
export interface UserState {
    user?: USER_RESULT;
    status: STATE_STATUS;
    auth?: AUTH_TOKEN;
    is_logged_in: boolean;
    token_expiration?: number;
}

export const initialState: UserState = {
    user: savedUser,
    status: 'pending',
    auth: undefined,
    is_logged_in: initialTokenExpiration > 0,
    token_expiration: isBehindTime ? 0 : initialTokenExpiration,
};

export const authReducer = createReducer(
    initialState,
    on(userLogout, (state) => ({
        ...state,
        is_logged_in: false,
        user: undefined,
        auth: undefined,
        token_expiration: 0,
    })),
    on(userSignIn, (state) => ({ ...state, status: 'pending' })),

    on(userSignUp, (state) => ({ ...state, status: 'pending' })),
    on(userAuthSuccess, (state, { user, auth }) => ({
        ...state,
        status: 'complete',
        user: user,
        auth: auth,
        token_expiration: auth.expiresIn,
        is_logged_in: true,
    })),
    on(userAuthFailure, (state) => ({
        ...state,
        status: 'error',
        is_logged_in: false,
    }))
);

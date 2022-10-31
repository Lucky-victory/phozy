import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { STORAGE_KEYS } from '../interfaces/common';
import { QUERY_RESPONSE } from '../interfaces/photo.interface';
import { IAuth, AUTH_USER } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiBaseUrl: string = environment.apiBaseUrl;
    constructor(private http: HttpClient) {}
    signIn(email_or_username: string, password: string) {
        return this.http
            .post<QUERY_RESPONSE<IAuth>>(`${this.apiBaseUrl}/sign-in`, {
                email_or_username,
                password,
            })
            .pipe(
                map((response) => response.data),
                tap((result) => this.setSession(result)),

                catchError(this.errorHandler)
            );
    }

    signUp({ fullname, email, password }) {
        return this.http
            .post<QUERY_RESPONSE<IAuth>>(`${this.apiBaseUrl}/sign-up`, {
                fullname,
                email,
                password,
            })
            .pipe(
                map((response) => response.data),
                tap((result) => this.setSession(result)),

                catchError(this.errorHandler)
            );
    }
    private errorHandler(error: HttpErrorResponse) {
        return throwError(error || '');
    }
    get User() {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return JSON.parse(user) as AUTH_USER;
    }
    setSession(res: IAuth) {
        const currentTime = new Date().getTime();
        const auth = res?.auth;
        const expiresAt = currentTime + auth?.expiresIn;
        localStorage.setItem(
            STORAGE_KEYS.TOKEN_EXPIRATION_TIME,
            JSON.stringify(expiresAt)
        );
        localStorage.setItem(
            STORAGE_KEYS.TOKEN_EXPIRATION,
            JSON.stringify(auth.expiresIn)
        );
        localStorage.setItem(STORAGE_KEYS.TOKEN, auth?.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res?.user));
    }
    logout() {
        console.log('logged out');

        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRATION);
        localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRATION_TIME);
        localStorage.removeItem(STORAGE_KEYS.USER);
    }
    get token() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    }
}

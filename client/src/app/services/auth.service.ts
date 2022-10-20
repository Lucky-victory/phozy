import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IAuth, AUTH_USER } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiBaseUrl: string = environment.apiBaseUrl;
    constructor(private http: HttpClient) {}
    signIn(email_or_username: string, password: string) {
        return this.http
            .post<IAuth>(
                `${this.apiBaseUrl}/sign-in`,
                { email_or_username, password },
                {
                    headers: {
                        'content-type': 'application/json',
                    },
                }
            )
            .pipe(tap((res) => this.setSession(res)))
            .pipe(catchError(this.errorHandler));
    }

    signUp({ fullname, email, password }) {
        return this.http
            .post(
                `${this.apiBaseUrl}/sign-up`,
                { fullname, email, password },
                {
                    headers: {
                        'content-type': 'application/json',
                    },
                }
            )
            .pipe(tap((res) => this.setSession(res)))
            .pipe(catchError(this.errorHandler));
    }
    errorHandler(error: HttpErrorResponse) {
        return throwError(error || '');
    }

   get isLoggedIn() {
        console.log(
            moment().isBefore(this.getExpiration())
        );
        
        return (
            moment().isBefore(this.getExpiration()) &&
            typeof this.getUser().username !== 'undefined'
        );
    }
    isLoggedOut() {
        return !this.isLoggedIn;
    }
    getUser() {
        const user = localStorage.getItem('phozy_user');
        return JSON.parse(user) as AUTH_USER;
    }
    private setSession(res) {
        const auth = res?.auth;
        const expiresAt = moment().add(auth?.expiresIn, 'second');
        localStorage.setItem('phozy_token', auth?.token);
        localStorage.setItem('phozy_user', JSON.stringify(res?.user));
        localStorage.setItem(
            'phozy_token_expiration',
            JSON.stringify(expiresAt.valueOf())
        );
    }
    logout() {
        localStorage.removeItem('phozy_token');
        localStorage.removeItem('phozy_token_expiration');
        localStorage.removeItem('phozy_user');
    }
    getToken() {
        return localStorage.getItem('phozy_token');
    }
    getExpiration() {
        const expiration = localStorage.getItem('phozy_token_expiration');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }
}

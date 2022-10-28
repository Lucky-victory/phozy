import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { ISignInForm } from 'src/app/interfaces/sign-in.interface';

import { AppState } from 'src/app/state/app.state';

import { selectUserState } from 'src/app/state/auth/auth.selectors';

@Component({
    selector: 'app-sign-in-page',
    templateUrl: './sign-in.page.html',
    styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
    result: any;
    errorResult: any;
    isSending: boolean;
    errorMessage: string;
    infoMessage: string;
    isText: boolean;
    isInModal!: boolean;
    signInForm: FormGroup<ISignInForm>;
    constructor(private store: Store<AppState>) {}
    ngOnInit() {}
    signIn() {
        this.store.select(selectUserState).subscribe(
            (res) => {},
            (error) => {
                this.isSending = false;
                this.errorResult = error;
                if (this.errorResult.error?.message) {
                    if (Array.isArray(error?.errors)) {
                        this.errorMessage = error?.errors[0]?.message;
                        return;
                    }
                    this.errorMessage = this.errorResult?.error?.message;
                } else {
                    this.errorMessage = this.errorResult?.message;
                }
            }
        );
    }
    passwordToText() {
        this.isText = !this.isText;
    }
}

import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { userSignUp } from 'src/app/state/auth/auth.actions';
import {
    selectAuthError,
    selectAuthStatus,
} from 'src/app/state/auth/auth.selectors';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ISignUpForm } from 'src/app/interfaces/sign-up.interface';

@Component({
    selector: 'app-sign-up-page',
    templateUrl: './sign-up.page.html',
    styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
    signUpForm: FormGroup<ISignUpForm>;
    isSending: boolean;
    infoMessage: string;
    isText: boolean;
    statusSub: Subscription;
    errorMessage$: any;
    constructor(
        private fb: FormBuilder,
        private utilsService: UtilitiesService,
        private store: Store<AppState>,
        private navCtrl: NavController
    ) {
        this.signUpForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            fullname: ['', [Validators.required, Validators.maxLength(30)]],
            password: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^(?=.*?[a-zA-Z0-9]).{6,}$/),
                ],
            ],
            // confirmPassword: ['', [Validators.required]],
            // username: ['',Validators.pattern(/([a-z0-9])/gi)],
        });
    }

    ngOnInit() {}
    signUp(event: Event) {
        event.preventDefault();
        this.isSending = true;
        this.errorMessage$ = null;
        const value = this.signUpForm.value;
        this.store.dispatch(
            userSignUp({
                fullname: value.fullname,
                password: value.password,
                email: value.email,
            })
        );
        this.statusSub = this.store
            .select(selectAuthStatus)
            .subscribe(async (status) => {
                this.isSending = status === 'pending';
                if (status === 'complete') {
                    this.infoMessage = 'Sign Up successful';
                    await this.utilsService.showToast({
                        message: this.infoMessage,
                    });

                    await this.navCtrl.navigateForward('/');
                    this.signUpForm.reset();
                }
            });
        this.errorMessage$ = this.store.select(selectAuthError);
    }
    passwordToText() {
        this.isText = !this.isText;
    }
}

import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { userSignUp } from 'src/app/state/auth/auth.actions';
import { selectAuthStatus } from 'src/app/state/auth/auth.selectors';
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
    errorMessage: string;
    errorResult: any;
    infoMessage: string;
    isText: boolean;
    statusSub: Subscription;
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
                this.isSending = status !== 'complete';
                if (status === 'complete') {
                    this.infoMessage = 'Sign Up successful';
                    await this.utilsService.showToast({
                        message: this.infoMessage,
                    });
                    /**
                      @todo, redirect user to previous url if any
                      *  */
                    await this.navCtrl.navigateForward('/');
                    this.signUpForm.reset();
                }
            });

        // this.authService
        //     .signUp({
        //         fullname: value.fullname,
        //         email: value.email,
        //         password: value.password,
        //     })
        //     .subscribe(
        //         () => {
        //             this.isSending = false;
        //             this.infoMessage = 'Sign up successful';
        //             setTimeout(() => {
        //                 this.location.historyGo(-1);
        //             }, 2500);
        //         },
        //         (error) => {
        //             this.isSending = false;
        //             this.errorResult = error;

        //             //if the server returns an array errors
        //             if (this.errorResult?.error?.errors) {
        //                 this.errorMessage = this.errorResult?.error?.errors
        //                     ?.map((err) => {
        //                         return [`${err?.param}: ${err?.message}`];
        //                     })
        //                     .join('\n\t\n');
        //             } else if (this.errorResult?.error?.message) {
        //                 this.errorMessage = this.errorResult?.error?.message;
        //             } else {
        //                 this.errorMessage = this.errorResult?.message;
        //             }
        //         }
        //     );
    }
    passwordToText() {
        this.isText = !this.isText;
    }
}

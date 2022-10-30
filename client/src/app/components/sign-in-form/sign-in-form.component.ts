import { Location, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormsModule,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ModalController, IonicModule, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ISignInForm } from 'src/app/interfaces/sign-in.interface';
import { USER_RESULT } from 'src/app/interfaces/user.interface';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { AppState } from 'src/app/state/app.state';
import { userSignIn } from 'src/app/state/auth/auth.actions';
import {
    selectAuthStatus,
    selectUser,
    selectUserState,
} from 'src/app/state/auth/auth.selectors';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sign-in-form',
    templateUrl: './sign-in-form.component.html',
    styleUrls: ['./sign-in-form.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        IonicModule,
    ],
})
export class SignInFormComponent implements OnInit, OnDestroy {
    result: any;
    errorResult: any;
    isSending: boolean;
    errorMessage: string;
    infoMessage: string;
    isText: boolean;
    isInModal!: boolean;
    signInForm: FormGroup<ISignInForm>;
    statusSub!: Subscription;
    constructor(
        private store: Store<AppState>,

        public utilsService: UtilitiesService,
        private navCtrl: NavController,
        private location: Location,
        private fb: FormBuilder,
        public modalCtrl: ModalController
    ) {
        this.signInForm = this.fb.group({
            emailOrUsername: ['', [Validators.required]],

            password: ['', [Validators.required, ,]],
        });
    }

    ngOnInit() {}
    async signIn() {
        const email_or_username = this.signInForm.get('emailOrUsername').value;
        const password = this.signInForm.get('password').value;
        console.log('signing in');

        this.errorResult = null;
        this.isSending = true;
        this.store.dispatch(userSignIn({ email_or_username, password }));
        this.statusSub = this.store
            .select(selectAuthStatus)
            .subscribe(async (status) => {
                this.isSending = status !== 'complete';
                if (status === 'complete') {
                    this.infoMessage = 'Sign in successful';
                    await this.utilsService.showToast({
                        message: this.infoMessage,
                    });
                    await this.navCtrl.navigateForward('/');
                    this.signInForm.reset();
                    if (this.isInModal) {
                        await this.modalCtrl.dismiss();
                    }
                }
            });
    }
    passwordToText() {
        this.isText = !this.isText;
    }
 async   closeModal() {
        if (this.isInModal) {
            await this.modalCtrl.dismiss();
        }
    }
    ngOnDestroy(): void {
        if (this.statusSub) {
            this.statusSub.unsubscribe();
        }
    }
}

import { Location, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormsModule,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ModalController, IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ISignInForm } from 'src/app/interfaces/sign-in.interface';
import { USER_RESULT } from 'src/app/interfaces/user.interface';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { AppState } from 'src/app/state/app.state';
import { userSignIn } from 'src/app/state/auth/auth.actions';
import { selectUser, selectUserState } from 'src/app/state/auth/auth.selectors';
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
export class SignInFormComponent implements OnInit {
    result: any;
    errorResult: any;
    isSending: boolean;
    errorMessage: string;
    infoMessage: string;
    isText: boolean;
    isInModal!: boolean;
    signInForm: FormGroup<ISignInForm>;
    user$: Observable<USER_RESULT>;
    constructor(
        private store: Store<AppState>,

        public utilsService: UtilitiesService,
        private router: Router,
        private location: Location,
        private fb: FormBuilder,
        public modalCtrl: ModalController
    ) {
        this.signInForm = this.fb.group({
            emailOrUsername: ['', [Validators.required]],

            password: ['', [Validators.required, ,]],
        });
    }

    ngOnInit() {
        this.user$ = this.store.select(selectUser);
        this.user$.subscribe((user) => {
            console.log(user, 'user');
        });
        // if the user is already logged in, redirect back to homepage
        // if (this.authService.isLoggedIn) {
        //   this.router.navigateByUrl('/')
        // }
    }
    signIn() {
        const email_or_username = this.signInForm.get('emailOrUsername').value;
        const password = this.signInForm.get('password').value;
        console.log('sign in triggered');

        this.errorResult = null;
        this.isSending = true;
        this.store.dispatch(userSignIn({ email_or_username, password }));
    }
    passwordToText() {
        this.isText = !this.isText;
    }
}

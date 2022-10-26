import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ISignInForm } from 'src/app/interfaces/sign-in.interface';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { AppState } from 'src/app/state/app.state';
import { userSignIn } from 'src/app/state/auth/auth.actions';
import { selectUserState } from 'src/app/state/auth/auth.selectors';
import { AuthService } from '../../services/auth.service';

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
  isInModal!:boolean;
  signInForm:FormGroup<ISignInForm>
  constructor(private store:Store<AppState>,private authService:AuthService,public utilsService:UtilitiesService, private router:Router,private location:Location,private fb:FormBuilder,public modalCtrl:ModalController) {
    this.signInForm = this.fb.group({
      emailOrUsername: ['', [ Validators.required]],

      password: [
        '',
        [
          Validators.required,
          ,
        ],
      ],
    });
  }
  
  ngOnInit() {
    // if the user is already logged in, redirect back to homepage
    // if (this.authService.isLoggedIn) {
    //   this.router.navigateByUrl('/')
    // }
  }
  signIn() {
     const email_or_username = this.signInForm.get('emailOrUsername').value;
    const password = this.signInForm.get('password').value;

    this.errorResult = null;
    this.isSending = true;
    this.store.dispatch(userSignIn({ email_or_username, password }));
    this.store.select(selectUserState).subscribe((res) => {
      this.result = res;
      this.isSending = false;
      this.infoMessage = 'Sign in successful';
      this.utilsService.showToast({
        message:this.infoMessage
      })
      if (this.isInModal) {
        this.modalCtrl.dismiss();
      }
    }, error => {
      this.isSending = false;
      this.errorResult = error;
       if( this.errorResult.error?.message) {
         if (Array.isArray(error?.errors)) {
           
           this.errorMessage = error?.errors[0]?.message;
           return
         }
          this.errorMessage = this.errorResult?.error?.message;
        }
        else {
          this.errorMessage = this.errorResult?.message;
        }
      }) 
  }
  passwordToText() {
    this.isText = !this.isText;
  }
}

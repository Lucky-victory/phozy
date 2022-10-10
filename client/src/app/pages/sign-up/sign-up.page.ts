import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  signUpForm: FormGroup;
  isSending: boolean;
  errorMessage: string;
  errorResult: any;
  infoMessage: string;
  isText: boolean;
  constructor(private fb: FormBuilder,private location:Location,private authService:AuthService) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', [Validators.required, Validators.maxLength(30)]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*?[a-zA-Z0-9]).{6,}$/
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
        ],
      ],
      username: ['',Validators.pattern(/([a-z0-9])/gi)],
    });
  }

  ngOnInit() { }
  signUp(event:Event) {
    event.preventDefault();
     this.isSending = true;
    const value = this.signUpForm.value;
      this.authService.signUp({fullname:value.fullname,email: value.email, password:value.password,username: value.username,confirm_password:value.confirmPassword}).subscribe(() => {
        this.isSending = false;
         this.infoMessage='Sign up successful'
        setTimeout(() => {
          
          this.location.historyGo(-1);
        }, 2500)
      },(error)=>{
        this.isSending = false;
        this.errorResult = error;
        
        //if the server returns an array errors
        if (this.errorResult?.error?.errors) {
          
          this.errorMessage = this.errorResult?.error?.errors?.map((err) => {
          
            return [
              `${err?.param}: ${err?.message}`
            ]
          }).join('\n\t\n');
        
        }
          else if (this.errorResult?.error?.message) {
            
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

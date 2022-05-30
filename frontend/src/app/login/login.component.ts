import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedin?: boolean = false;
  picture = "";
  constructor(private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private toastr: ToastrService,
    private api: ApiService,
    private FormBuilder: FormBuilder,

  ) {  }

  ngOnInit(): void {
    var x = localStorage.getItem('accessToken');
    if(x){
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.FormBuilder.group({
      'email' : new FormControl(null,[Validators.required,Validators.email]),
      'password' : new FormControl(null,[Validators.minLength(6),Validators.maxLength(10),Validators.required]),
  });
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.api.checkDuplicateUser(this.socialUser)
        .subscribe({
          next: (res) => {
            //alert(res.error);
            if (res.error === 201) {
              this.toastr.warning('fill password field and press signup', 'Please Registered Here !');
              this.isLoggedin = user != null;
              this.router.navigate(['/socialLogin']);
              this.api.setData(this.socialUser);
            }
            if (res.error === 409) {
              this.toastr.warning('Please Login', 'User Already Exists!');
              this.socialUser = user;
              this.isLoggedin = true;
              console.log(this.socialUser);
            }
          },
          error: (e) => {
            console.log(e);
            this.toastr.error('Error While User Registration');
          }

        })
    });
  }   // end of LoginWithFacebook

  get email(){
    return this.loginForm.get('email');
  }
  get password(){
    return this.loginForm.get('password');
  }


  signOut(): void {
    this.socialAuthService.signOut();
    this.isLoggedin = false;
    this.toastr.error("Log Out Successfull");
  }

  loginWithGoogle(): any {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.api.checkDuplicateUser(this.socialUser)
        .subscribe({
          next: (res) => {
            //alert(res.error);
            if (res.error === 201) {
              this.toastr.success('fill password field and press signup', 'Please Registered Here !');
              this.isLoggedin = user != null;
              this.router.navigate(['/socialLogin']);
              this.api.setData(this.socialUser);
            }
            if (res.error === 409) {
              this.toastr.warning('Please Login', 'User Already Exists!');
              //this.router.navigate(['/login']);
              this.socialUser = user;
              console.log(this.socialUser);
              this.isLoggedin = true;
            }
          },
          error: (e) => {
            console.log(e);
            this.toastr.error('Error While User Registration');
          }

        })
    });

  } // end of loginWithGoogle

  login_Func(){
    if(this.loginForm.invalid){
      return ;
    }
    else{
      this.api.loginApi(this.loginForm.value)
        .subscribe({
          next: (res) => {
            //alert(res.error);
            if (res.success === 200) {
              //console.log(res);
              this.api.setToken(res);
              this.toastr.success(res.name+" "+res.lname, 'Welcome ');
              this.router.navigate(['/dashboard']);
            }
            if (res.failed === 'incorrect_password') {
              this.toastr.warning('Please try again', 'Invalid Password. ');
            }
            if (res.failed === 'user_not_found') {
              this.toastr.warning('Please try again', 'Invalid E-mail. ');
            }
          },
          error: (e) => {
            console.log(e);
            this.toastr.error('Error While User Registration');
          }

        })
    }
  } // end of login_Func

} //end of class 


import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SocialAuthService } from 'angularx-social-login';
import { FormBuilder, FormGroup, Validators,FormControl } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registered-via-social',
  templateUrl: './registered-via-social.component.html',
  styleUrls: ['./registered-via-social.component.css']
})
export class RegisteredViaSocialComponent implements OnInit {

  constructor(private api: ApiService,
    private SocialAuthService: SocialAuthService,
    private FormBuilder : FormBuilder,
    private toastr : ToastrService, private router : Router) { }
  isLoggedin : boolean = false;
  socialUser: any;
  myForm !: FormGroup;
  selectedFile !: File;
  ngOnInit(): void {
    this.socialUser =  this.api.getData()
    if(this.socialUser){
      //console.log(this.socialUser);
      this.isLoggedin = true
    }
    this.myForm = this.FormBuilder.group({
      'password' : new FormControl(null,[Validators.minLength(6),Validators.maxLength(10),Validators.required]),
      'conf_password' : new FormControl(null,[Validators.minLength(6),Validators.maxLength(10),Validators.required]),
    })
  }
  
  get password(){
    return this.myForm.get('password');
  }
  get conf_password(){
    return this.myForm.get('conf_password');
  }

  


  onFileSelected(event:any){
    //console.log(event);
    this.selectedFile= <File> event.target.files[0];
  }

  registration_func():void{
    if(this.myForm.invalid){
      alert("invalid");
      return;
    }
    if(this.myForm.valid){
      //alert(this.myForm.value.password);
      const fd = new FormData();
      fd.append('photo_url',this.socialUser.photoUrl);
      fd.append('email',this.socialUser.email);
      fd.append('password',this.myForm.value.password);
      fd.append('name',this.socialUser.firstName);
      fd.append('lname',this.socialUser.lastName);
      fd.append('provider_id',this.socialUser.id);
      fd.append('provider_name',this.socialUser.provider);
      // fd.append('gender',this.myForm.value.gender);
      // fd.append('city',this.myForm.value.city);
      // fd.append('dob',this.myForm.value.dob);
      this.api.addUserData(fd)
      .subscribe({
        next:(res)=>{
            //alert(res.error);
            if(res.error===201){
              this.toastr.success('Registration Successfully');
              this.router.navigate(['/login']);
            }
            if(res.error===409){
              this.toastr.warning('Please Login','User Already Exists!');
              this.router.navigate(['/login']);
            }   
        },
        error:(e)=>{
          console.log(e);
          this.toastr.error('Error While User Registration');
        }
        
      })
    }
  }


  signOut(): void {
    //this.socialAuthService.signOut();
     this.isLoggedin = false;
     //this.toastr.error("Log Out Successfull");
   }

}

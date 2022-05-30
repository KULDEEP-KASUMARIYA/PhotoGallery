import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  myForm !: FormGroup;
  selectedFile !: File;
  // submitted = false;
  cities = ['Ujjain', 'Bhopal', 'Ratlam', 'Indore', 'Jabalpur'];
  constructor(private FormBuilder: FormBuilder, private api: ApiService,
    private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.myForm = this.FormBuilder.group({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.minLength(6), Validators.maxLength(10), Validators.required]),
      'conf_password': new FormControl(null, [Validators.minLength(6), Validators.maxLength(10), Validators.required]),
      'name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]+$')]),
      'lname': new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]+$')]),
      'dob': new FormControl('', Validators.required),
      'image': new FormControl('', [Validators.required]),
      'gender': new FormControl('', [Validators.required]),
      'city': new FormControl('', [Validators.required])
    })
  }
  get email() {
    return this.myForm.get('email');
  }
  get password() {
    return this.myForm.get('password');
  }
  get conf_password() {
    return this.myForm.get('conf_password');
  }
  get name() {
    return this.myForm.get('name');
  }
  get lname() {
    return this.myForm.get('lname');
  }
  get dob() {
    return this.myForm.get('dob');
  }
  get image() {
    return this.myForm.get('image');
  }
  get gender() {
    return this.myForm.get('gender');
  }
  get city() {
    return this.myForm.get('city');
  }


  // convenience getter for easy access to form fields
  // get f() { return this.myForm.controls; }

  onFileSelected(event: any) {
    //console.log(event);
    this.selectedFile = <File>event.target.files[0];
  }

  registration_func(): void {
    if (this.myForm.valid) {
      const fd = new FormData();
      fd.append('photo', this.selectedFile, this.selectedFile.name);
      fd.append('email', this.myForm.value.email);
      fd.append('password', this.myForm.value.password);
      fd.append('name', this.myForm.value.name);
      fd.append('lname', this.myForm.value.lname);
      fd.append('gender', this.myForm.value.gender);
      fd.append('city', this.myForm.value.city);
      fd.append('dob', this.myForm.value.dob);
      this.api.checkDuplicateUser({'email':this.myForm.value.email})
        .subscribe({
          next: (res) => {
            if (res.error === 201) {
              this.api.addUserData(fd)
                .subscribe({
                  next: (res) => {
                    console.log(res.status);
                    this.toastr.success('User Added Successfully');
                    this.router.navigate(['login']);
                  },
                  error: (e) => {
                    console.log(e);
                    this.toastr.error('Error While User Inserted');
                  }

                })
            }
            if (res.error === 409) {
              this.toastr.warning('Please Login', 'User Already Exists!');
              this.router.navigate(['/login']);
            }
          },
          error: (e) => {
            console.log(e);
            this.toastr.error('Error While User Registration');
          }

        })
    }
  } // end of registration_func
  
}
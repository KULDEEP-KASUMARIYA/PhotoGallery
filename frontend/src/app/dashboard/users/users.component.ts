import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('myInput') myInputVariable: any;
  loginData: any;
  usersData: any;
  userDataForUpdate: any;
  userUpdateForm !: FormGroup;
  submitted = false;
  imageTypeError: boolean = false;
  selectedFile !: any;
  obj = [
    { 'name': 'kuldeep' },
    { 'name': 'aadesh' }
  ]
  constructor(private api: ApiService, private router: Router, private toastr: ToastrService,
    private FormBuilder: FormBuilder) {
  }



  ngOnInit(): void {
    var isLogined = localStorage.getItem('accessToken');
    if (!isLogined) {
      this.router.navigate(["/login"]);
    }
    this.loginData = isLogined;
    this.getUsersData();

    this.userUpdateForm = this.FormBuilder.group({
      'email': new FormControl(),
      'name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]+$')]),
      'lname': new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]+$')]),
      'gender': new FormControl('', [Validators.required]),
      'city': new FormControl('', [Validators.required]),
      'hidden_id': new FormControl(''),
      'hidden_image': new FormControl(''),
      'photo': new FormControl('')
    })
  }

  get name() {
    return this.userUpdateForm.get('name');
  }
  get lname() {
    return this.userUpdateForm.get('lname');
  }
  get gender() {
    return this.userUpdateForm.get('gender');
  }
  get city() {
    return this.userUpdateForm.get('city');
  }

  getUsersData(): void {
    this.api.getUsers()
      .subscribe({
        next: (res) => {
          this.usersData = res;
        }
      })
  }

  getEditUser(id: string) {
    this.api.getUserData({ 'id': id })
      .subscribe({
        next: (res) => {
          this.myInputVariable.nativeElement.value = "";
          this.imageTypeError = false;
          this.selectedFile = null;
          this.userUpdateForm.patchValue({
            email: res.email,
            name: res.name,
            lname: res.lname,
            gender: res.gender,
            city: res.city,
            hidden_id: res._id,
            hidden_image: res.image
          });
        }
      })
  }

  imageUpload(event: any) {
    let imageActive = event.target.files[0];
    let ext = imageActive.type.split('/')[1];
    if ((ext == 'jpeg') || (ext == 'jpg') || (ext == 'png')) {
      this.imageTypeError = false;
      this.selectedFile = imageActive;
    }
    else {
      this.imageTypeError = true;
    }

  }


  userDataUpdate(): void {
    this.submitted = true;
    if (this.userUpdateForm.invalid || this.imageTypeError) {
      return;
    }
    if (this.selectedFile) {
      // console.log(this.selectedFile.name);
      const fd = new FormData();
      fd.append('photo', this.selectedFile, this.selectedFile.name);
      fd.append('email', this.userUpdateForm.value.email);
      fd.append('name', this.userUpdateForm.value.name);
      fd.append('lname', this.userUpdateForm.value.lname);
      fd.append('gender', this.userUpdateForm.value.gender);
      fd.append('city', this.userUpdateForm.value.city);
      fd.append('hidden_id', this.userUpdateForm.value.hidden_id);
      fd.append('hidden_image', this.userUpdateForm.value.hidden_image);
      this.api.updateUserWithPhoto(
        fd
      )
        .subscribe({
          next: (res) => {
            if (res.UpdatedUserWithPhoto === 'UpdatedUserWithPhoto') {
              this.toastr.success("Data Updated Successfully");
              this.closebutton.nativeElement.click();
              this.ngOnInit();
            }
            if (res.NotChanges === 'NotChanges') {
              this.closebutton.nativeElement.click();
            }
          }
        })
    }
    else {
      let data = this.userUpdateForm.value;
      this.api.updateUserData(data)
        .subscribe({
          next: (res) => {
            if (res.UpdatedUser === 'UpdatedUser') {
              this.toastr.success("User Data Updated Successfully");
              this.ngOnInit();
              this.closebutton.nativeElement.click();
            }
            if (res.NotChanges === 'NotChanges') {
              this.closebutton.nativeElement.click();
            }
          }
        })
    }
  }

  deleteUser(id: any) {
    var a = confirm("Are You sure !");
    if (a) {
      this.api.deleteUser({ 'id': id })
        .subscribe({
          next: (res) => {

            if (res.msg == 'Deleted') {
              this.toastr.success("user Delete Successfully");
              this.ngOnInit();
            }
          }
        })
    }
    else {
      return
    }
  }

  changeStatus(status: number, id: string) {
    this.api.changeStatus({ "status": status, "id": id })
      .subscribe({
        next: (res) => {
          if (res.changedStatus === 1) {
            this.toastr.success("User Active", "", { timeOut: 500, progressAnimation: 'increasing' });
            this.ngOnInit();
          }
          if (res.changedStatus === 0) {
            this.toastr.warning("User Inactive", "", { timeOut: 500, progressAnimation: 'decreasing' });
            this.ngOnInit();
          }
        }
      })
  }
}

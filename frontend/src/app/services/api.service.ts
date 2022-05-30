import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor( private http :HttpClient) { }
  addUserData(data:any){
   return this.http.post<any>("http://localhost:3001/usersAdd",data);
  }

  checkDuplicateUser(data:any){
    return this.http.post<any>("http://localhost:3001/DuplicateUser",data);
   }

   loginApi(data:any){
     return this.http.post<any>("http://localhost:3001/LoginUser",data);
   }

   getUsers(){
     return this.http.get<any>("http://localhost:3001/getUsers");
   }

   getUserData(id:any){
    return this.http.post<any>("http://localhost:3001/getUserData",id);
  }

  updateUserData(data:any){
    return this.http.post<any>("http://localhost:3001/updateUserData",data);
  }

  updateUserWithPhoto(data:any){
    return this.http.post<any>("http://localhost:3001/updateUserWithPhoto", data);
  }

   deleteUser(id:any){
    return this.http.post<any>("http://localhost:3001/deleteUser",id);
  }

  changeStatus(status:any){
    return this.http.post<any>("http://localhost:3001/changeStatus",status);
  }

  sharedData :any;
  setData(updatedData:any) {
    this.sharedData = updatedData;
  }

  getData(){
    return this.sharedData;
  }

  setToken(data:any): void{
      localStorage.setItem('accessToken',JSON.stringify(data));
  }

  
}

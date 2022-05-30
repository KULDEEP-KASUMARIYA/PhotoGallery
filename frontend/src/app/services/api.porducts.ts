import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiProducts {

  constructor( private http :HttpClient) { }
  addProductApi(data:any){
    return this.http.post<any>("http://localhost:3001/addProductApi",data)
  }
  getProductApi(){
    return this.http.get<any>("http://localhost:3001/getProductApi")
  }
  getProductDetails(id:any){
    return this.http.post<any>("http://localhost:3001/getProductDetails",id);
  }

  updateProDetails(data:any){
    return this.http.post<any>("http://localhost:3001/updateProDetails",data);
  }

  deleteProduct(id:any){
    return this.http.post<any>("http://localhost:3001/deleteProduct", id);
  }
 
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loginData : any;

  constructor( private api :ApiService , private router :Router ) { 
  }

  
 
  ngOnInit(): void {
    this.loginData = localStorage.getItem('accessToken');
    if(!this.loginData){
      this.router.navigate(["/login"]);
    }
    
  }
 
  


}

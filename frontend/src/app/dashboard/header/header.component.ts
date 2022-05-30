import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loginData : any;

  constructor( private api :ApiService , private router :Router ) { 
  }

  ngOnInit(): void {
    this.loginData = localStorage.getItem('accessToken');
    this.loginData = JSON.parse( this.loginData)
  }

  logOut(){
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditDeleteProductsComponent } from './dashboard/edit-delete-products/edit-delete-products.component';
import { ProductComponent } from './dashboard/product/product.component';
import { UsersComponent } from './dashboard/users/users.component';
import { LoginComponent } from './login/login.component';
import { RegisteredViaSocialComponent } from './registered-via-social/registered-via-social.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {path:"" , component:LoginComponent},
  {path:"registration" , component:RegistrationComponent},
  {path:"login" , component:LoginComponent},
  {path:"dashboard",component:DashboardComponent},
  {path:"socialLogin",component:RegisteredViaSocialComponent},
  {path: "users",component:UsersComponent},
  {path : "products",component:ProductComponent},
  {path :"editDeletePro",component:EditDeleteProductsComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

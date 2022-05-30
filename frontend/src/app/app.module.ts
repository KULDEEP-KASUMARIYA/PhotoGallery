import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FacebookLoginProvider, SocialLoginModule ,SocialAuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisteredViaSocialComponent } from './registered-via-social/registered-via-social.component';
import { UsersComponent } from './dashboard/users/users.component';
import { HeaderComponent } from './dashboard/header/header.component';
import { ProductComponent } from './dashboard/product/product.component';
import { EditDeleteProductsComponent } from './dashboard/edit-delete-products/edit-delete-products.component';
import { OrderByPipe } from './pipe/order-by.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    RegisteredViaSocialComponent,
    UsersComponent,
    HeaderComponent,
    ProductComponent,
    EditDeleteProductsComponent,
    OrderByPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut:3000,
      progressBar:true,
      progressAnimation:'increasing',
      tapToDismiss:true,
      closeButton:false,
      maxOpened: 1,
    }),
    SocialLoginModule,
    BrowserAnimationsModule

  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('574228837304442')
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com'
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

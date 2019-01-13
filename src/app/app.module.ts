import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";

import { AppComponent } from "./app.component";
import { appRoutes } from "./app.routes";

import { MaterialModule } from "./material.module";

import { AuthenticationService } from "./core/services/authentication.service";
import { DialogService } from "./core/services/dialog.service";

import { AppHeaderComponent } from "./components/app-header/app-header.component";
import { CreateApartmentComponent } from './components/create-apartment/create-apartment.component';
import { DialogComponent } from "./components/dialog/dialog.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";

import { UserContract } from "./core/contracts/user.contract";
import { userReducer } from "./core/store/user.reducer";

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    CreateApartmentComponent,
    DialogComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot({
      user: userReducer
    })
  ],
  providers: [AuthenticationService, DialogService, UserContract],
  entryComponents: [DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

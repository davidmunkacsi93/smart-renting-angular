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
import { ApartmentContract } from "./core/contracts/apartment.contract";
import { Web3Utils } from "./core/utils/web3.utils";
import { DataCardComponent } from './components/data-card/data-card.component';
import { BrowseApartmentsComponent } from './components/browse-apartments/browse-apartments.component';
import { AuthenticationGuard } from "./core/guards/authentication-guard";
import { ApartmentDetailComponent } from './components/apartment-detail/apartment-detail.component';
import { NotifierModule } from "angular-notifier";

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    CreateApartmentComponent,
    DialogComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DataCardComponent,
    BrowseApartmentsComponent,
    ApartmentDetailComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MaterialModule,
    NotifierModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot({
      user: userReducer
    })
  ],
  providers: [
    AuthenticationGuard,
    AuthenticationService,
    DialogService,
    ApartmentContract,
    UserContract,
    Web3Utils
  ],
  entryComponents: [DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

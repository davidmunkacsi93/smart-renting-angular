import { Routes } from '@angular/router'

import { CreateApartmentComponent } from './components/create-apartment/create-apartment.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent  } from './components/login/login.component';
import { RegisterComponent  } from './components/register/register.component';
import { BrowseApartmentsComponent } from './components/browse-apartments/browse-apartments.component';
import { AuthenticationGuard } from './core/guards/authentication-guard';
import { ApartmentDetailComponent } from './components/apartment-detail/apartment-detail.component';
import { MyRentsComponent } from './components/my-rents/my-rents.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'apartment-detail/:id', component: ApartmentDetailComponent, canActivate: [AuthenticationGuard] },
    { path: 'browse-apartments', component: BrowseApartmentsComponent, canActivate: [AuthenticationGuard] },
    { path: 'create-apartment', component: CreateApartmentComponent, canActivate: [AuthenticationGuard] },
    { path: 'my-rents', component: MyRentsComponent, canActivate: [AuthenticationGuard] },

    { path: '**', redirectTo: 'login' }
]
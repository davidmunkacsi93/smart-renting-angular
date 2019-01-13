import { Routes } from '@angular/router'

import { CreateApartmentComponent } from './components/create-apartment/create-apartment.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent  } from './components/login/login.component';
import { RegisterComponent  } from './components/register/register.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'create-apartment', component: CreateApartmentComponent },

    { path: '**', redirectTo: 'login' }
]
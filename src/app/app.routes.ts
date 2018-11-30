import { Routes } from '@angular/router'

import { LoginComponent } from './components/login/login.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },

    { path: '**', redirectTo: 'login' }
]
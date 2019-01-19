import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from './core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private authenticationService: AuthenticationService,
    private router : Router
  ) {}

  @HostListener('window:beforeunload')
  autoLogout() {

  }
}

import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authenticationService: AuthenticationService) {}

  @HostListener('window:beforeunload')
  autoLogout() {
    this.authenticationService.logout();
  }
}

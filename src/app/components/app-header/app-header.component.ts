import { OnInit, Component, AfterViewInit } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../core/store/state";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"]
})
export class AppHeaderComponent implements OnInit {
  userSubscription: Subscription;

  username: string;
  balanceInEth: string;
  balanceInEur: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.userSubscription = this.store
      .select(state => state.user)
      .subscribe(user => {
        if (user) {
          this.username = user.Username;
          this.balanceInEth = user.BalanceInEth.toFixed(3);
          this.balanceInEur = user.BalanceInEur.toFixed(3);
        }
      });
  }

  createApartment() {
    this.router.navigate(["/create-apartment"], { skipLocationChange: false });
  }

  navigateToMyApartments() {
    this.router.navigate(["/home"], { skipLocationChange: false });
  }

  navigateToBrowseApartments() {
    this.router.navigate(["/browse-apartments"], { skipLocationChange: false });
  }

  navigateToMyRents() {
    this.router.navigate(["/my-rents"], { skipLocationChange: false });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/"], { skipLocationChange: false });
  }
}

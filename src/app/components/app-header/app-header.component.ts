import { OnInit, Component, AfterViewInit, Inject } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../core/store/state";
import { Router, Event } from "@angular/router";
import { ApartmentContract } from "src/app/core/contracts/apartment.contract";
import { Web3Provider } from "src/app/core/providers/web3.provider";
import Web3 from "web3";
import { EventLog } from "web3/types";
import { Subscription } from "rxjs";
import { EventEmitter } from "protractor";

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
    @Inject(Web3Provider) private provider : Web3,
    private apartmentContract: ApartmentContract,
    private authenticationService: AuthenticationService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  async ngOnInit() {
    this.userSubscription = this.store
      .select(state => state.user)
      .subscribe(user => {
        if (user) {
          this.username = user.Username;
          this.balanceInEth = user.BalanceInEth.toFixed(3);
          this.balanceInEur = user.BalanceInEur.toFixed(3);
        }
      });
      this.apartmentContract.getContract().events.Payment()
        .on("data", log => { console.log(log)})
        .on("changed", log => { console.log(log)})
        .on("error", log => { console.log(log)})
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

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
import { WebSocketProvider } from "src/app/core/providers/websocket.provider";
import { NotifierService } from "angular-notifier";
import { UserContract } from "src/app/core/contracts/user.contract";
import { RefreshBalanceAction } from "src/app/core/actions";
import { WebSocketUtils } from "src/app/core/utils/websocket.utils";

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"]
})
export class AppHeaderComponent implements OnInit {
  userSubscription: Subscription;

  username: string;
  address: string;
  balanceInEth: string;
  balanceInEur: string;

  constructor(
    @Inject(WebSocketProvider) private socket : any,
    private userContract: UserContract,
    private authenticationService: AuthenticationService,
    private notifierService: NotifierService,
    private router: Router,
    private store: Store<AppState>,
    private webSocketUtils: WebSocketUtils
  ) {}

  async ngOnInit() {
    this.userSubscription = this.store
      .select(state => state.user)
      .subscribe(user => {
        if (user) {
          this.username = user.Username;
          this.address = user.Address;
          this.balanceInEth = user.BalanceInEth.toFixed(3);
          this.balanceInEur = user.BalanceInEur.toFixed(3);
        }
      });
      this.socket.on("payment", data => {
          this.notifierService.notify("info", data.username + " transferred you " + data.amount + "€.");
          this.socket.emit('paymentApproved', this.webSocketUtils.createWebSocketData(data.to, data.from, this.username));
          this.userContract.getCurrentUserBalance().then(balances => {
            this.store.dispatch(new RefreshBalanceAction(balances))
          });
      });

      this.socket.on("rentPaid", data => {
        this.notifierService.notify("info", data.username + " transferred you " + data.amount + "€.");
        this.userContract.getCurrentUserBalance().then(balances => {
          this.store.dispatch(new RefreshBalanceAction(balances))
        });
    });

      this.socket.on("contractTerminated", data => {
        this.notifierService.notify("info", data.username + " terminated his/her contract.");
        this.userContract.getCurrentUserBalance().then(balances => {
          this.store.dispatch(new RefreshBalanceAction(balances))
        });
      })
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

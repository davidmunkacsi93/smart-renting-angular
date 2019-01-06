import { OnInit, Component, AfterViewInit } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../core/store/state";
import { Subscription } from "rxjs";

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
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.userSubscription = this.store
      .select(state => state.user)
      .subscribe(user => {
        if (user) {
          this.username = user.Username;
          this.balanceInEth = user.BalanceInEth.toPrecision(3);
          this.balanceInEur = user.BalanceInEur.toPrecision(3);
        }
      });
  }
}

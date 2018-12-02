import { OnInit, Component, AfterViewInit } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service"

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements AfterViewInit {

    username: string;
    balanceInEth: number;
    balanceInEur: number;

    constructor(
        private authenticationService: AuthenticationService
    ) {

    }

    ngAfterViewInit(): void {
        var user = this.authenticationService.getCurrentUser();
        console.log(user);
        this.username = user.Username;
        this.balanceInEth = user.BalanceInEth;
        this.balanceInEur = user.BalanceInEur;
    }
}
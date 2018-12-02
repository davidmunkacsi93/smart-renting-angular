import { OnInit, Component } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service"

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

    private username: string;
    private currentBalanceInEur: number;
    private currentBalanceInEth: number;

    constructor(
        private authenticationService: AuthenticationService
    ) {
    }

    ngOnInit() {
        this.username = "david.munkacsi";
        this.currentBalanceInEur = 100;
        this.currentBalanceInEth = 100;
    }
}
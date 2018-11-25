import { OnInit, Component } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service"

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

    constructor(
        private authenticationService: AuthenticationService
    ) {
    }

    ngOnInit() {
        console.log(this.authenticationService.getEthereumAccounts());
    }
}
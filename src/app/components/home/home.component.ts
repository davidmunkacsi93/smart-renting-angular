import { Component, ElementRef, AfterViewInit, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { Router } from "@angular/router";
import { ApartmentContract } from "src/app/core/contracts/apartment.contract";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {

    constructor(
        private apartmentContract: ApartmentContract,
        private authenticationService : AuthenticationService,
        private elementRef : ElementRef,
        private router: Router
    ) {}

    ngOnInit() {
        if (this.authenticationService.isAuthenticated() === false) {
            this.router.navigate(["/"], { skipLocationChange: false });
        }

        this.apartmentContract.getApartmentIds().then(ids => console.log(ids));
    }

    ngAfterViewInit(): void {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#829356';
    }
}
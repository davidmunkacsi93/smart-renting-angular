import { Component, ElementRef, AfterViewInit, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { Router } from "@angular/router";
import { ApartmentContract } from "src/app/core/contracts/apartment.contract";
import { Apartment } from "src/app/core/model/apartment";
import { UserContract } from "src/app/core/contracts/user.contract";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {

    private apartments : Apartment[] = [];

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

        this.apartments = [];
        this.apartmentContract.getApartmentIds().then(ids => {
            ids.forEach(id => {
                this.apartmentContract.getApartmentDetails(parseInt(id)).then(apartment => {
                    this.apartments.push(apartment)
                });
            });
        });
        console.log(this.apartments);
    }

    ngAfterViewInit(): void {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#829356';
    }
}
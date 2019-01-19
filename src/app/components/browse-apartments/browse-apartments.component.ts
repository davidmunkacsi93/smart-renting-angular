import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ApartmentContract } from 'src/app/core/contracts/apartment.contract';
import { Router } from '@angular/router';
import { Apartment } from 'src/app/core/model/apartment';

@Component({
  selector: 'app-browse-apartments',
  templateUrl: './browse-apartments.component.html',
  styleUrls: ['./browse-apartments.component.scss']
})
export class BrowseApartmentsComponent implements OnInit, AfterViewInit {

  private apartments : Apartment[] = [];

  constructor(
      private apartmentContract: ApartmentContract,
      private elementRef : ElementRef,
      private router: Router
  ) {}

  ngOnInit() {
    this.apartmentContract.getAvailableApartments().then(apartments => {
      this.apartments = apartments;
    });
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#829356';
  }

}

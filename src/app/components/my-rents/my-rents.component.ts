import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ApartmentContract } from 'src/app/core/contracts/apartment.contract';
import { Router } from '@angular/router';
import { Apartment } from 'src/app/core/model/apartment';

@Component({
  selector: 'app-my-rents',
  templateUrl: './my-rents.component.html',
  styleUrls: ['./my-rents.component.scss']
})
export class MyRentsComponent implements OnInit, AfterViewInit {

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

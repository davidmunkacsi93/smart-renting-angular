import { Component, OnInit, Input } from '@angular/core';
import { Apartment } from 'src/app/core/model/apartment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-card',
  templateUrl: './data-card.component.html',
  styleUrls: ['./data-card.component.scss']
})
export class DataCardComponent implements OnInit {

  @Input() apartmentId: number;
  @Input() address: string;
  @Input() deposit: number;
  @Input() rent: number;
  @Input() isRented: boolean;
  @Input() browsing: boolean;
  @Input() myRents: boolean;
  @Input() ownerName: string;
  @Input() tenantName: string;

  constructor(private router : Router) { }

  ngOnInit() {
  }

  navigateToApartment(apartmentId : number) {
    this.router.navigate(["/apartment-detail/" + apartmentId], { skipLocationChange: false })
  }

}

import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApartmentContract } from 'src/app/core/contracts/apartment.contract';
import { Apartment } from 'src/app/core/model/apartment';

@Component({
  selector: 'app-apartment-detail',
  templateUrl: './apartment-detail.component.html',
  styleUrls: ['./apartment-detail.component.scss']
})
export class ApartmentDetailComponent implements OnInit, AfterViewInit {

  private apartment : Apartment;

  constructor(
    private elementRef : ElementRef,
    private route: ActivatedRoute,
    private apartmentContract: ApartmentContract
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      var apartmentId = +params['id'];
      this.apartmentContract.getApartmentDetails(apartmentId).then(apartment => {
        this.apartment = apartment;
        console.log(apartment);
      });
    });
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#829356';
  }
}

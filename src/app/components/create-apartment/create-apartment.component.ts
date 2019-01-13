import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-apartment',
  templateUrl: './create-apartment.component.html',
  styleUrls: ['./create-apartment.component.scss']
})
export class CreateApartmentComponent implements OnInit {

  loading: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { Apartment } from 'src/app/core/model/apartment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-apartment',
  templateUrl: './create-apartment.component.html',
  styleUrls: ['./create-apartment.component.scss']
})
export class CreateApartmentComponent implements OnInit {

  apartment: Apartment;
  apartmentForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder : FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.apartmentForm = this.formBuilder.group({
      postCode: [0,
        [
          Validators.required,
          Validators.minLength(5),
           Validators.maxLength(5)
        ],
      ],
      city: ['', Validators.required],
      street: ['', Validators.required],
      houseNumber: [0, Validators.required],
      floor: [0, Validators.required],
      description: ['', Validators.required],
      rent: [0, Validators.required],
      deposit: [0, Validators.required]
    });
  }

  get form() {
    return this.apartmentForm.controls;
  }

  onSubmitForm() {
    console.log(this.apartmentForm);
    this.submitted = true;
    if (this.apartmentForm.invalid) {
      return;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Apartment } from 'src/app/core/model/apartment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApartmentContract } from 'src/app/core/contracts/apartment.contract';
import { DialogService } from 'src/app/core/services/dialog.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

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
    private apartmentContract: ApartmentContract,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.apartmentForm = this.formBuilder.group({
      postCode: ['',
        [
          Validators.required,
          Validators.minLength(5),
           Validators.maxLength(5)
        ],
      ],
      city: ['', Validators.required],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      floor: ['', Validators.required],
      description: ['', Validators.required],
      rent: ['', Validators.required],
      deposit: ['', Validators.required]
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

    var currentUser = this.authenticationService.getCurrentUser();

    var apartment : Apartment = {
      Id: 0,
      Owner: currentUser.Address,
      Tenant: null,
      PostCode: this.form.postCode.value,
      City: this.form.city.value,
      Street: this.form.street.value,
      HouseNumber: this.form.houseNumber.value,
      Floor: this.form.floor.value,
      Rent: this.form.rent.value,
      Deposit: this.form.deposit.value,
      Description: this.form.description.value,
      IsRented: false
    }

    this.loading = true;
    this.apartmentContract.createApartment(apartment)
        .then(() => {
            this.loading = false;
            this.dialogService.openDialog("Create apartment", "Apartment was successfully created.");
            // this.router.navigate(['/home'], { skipLocationChange: true });
        })
        .catch(exc => {
            this.loading = false;
            this.dialogService.openDialog("Create apartment", exc);
        });
  }

}

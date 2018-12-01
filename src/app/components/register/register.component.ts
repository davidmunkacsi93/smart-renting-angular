import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {

    registerForm: FormGroup;
    submitted: boolean = false;
    loading: boolean = false;

    constructor(
        private authenticationService: AuthenticationService,
        private dialogService: DialogService,
        private elementRef: ElementRef,
        private formBuilder : FormBuilder
    ) {

    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnDestroy() {

    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#2e4a62';
    }

    get form() {
        return this.registerForm.controls;
    }

    onSubmitForm() {
        this.submitted = true;
        if (this.registerForm.invalid) {
          return;
        }

        this.loading = true;
        this.authenticationService.register(this.form.username.value, this.form.password.value)
            .then(address => {
                this.dialogService.openDialog("Registration successful", "The user was created with the following address: " + address + "\n\nYou can now login.");
            })
            .catch(reason => {
                console.error(reason);
                this.dialogService.openDialog("Registration error", "The user could not be registered. Please try again!");
            });
        
    }
}
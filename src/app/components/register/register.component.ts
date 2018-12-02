import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'

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
        private formBuilder : FormBuilder,
        private router: Router
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
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#0C374D';
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
                this.loading = false;
                this.dialogService.openDialog("Registration successful", "The user was created with the following address: " + address + "\n\nYou can now login.");
                this.router.navigate(['/login'], { skipLocationChange: true });
            })
            .catch(exc => {
                this.loading = false;
                this.dialogService.openDialog("Registration error", exc);
            });
        
    }
}
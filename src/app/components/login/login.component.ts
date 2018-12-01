import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

    loginForm: FormGroup;
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
        this.loginForm = this.formBuilder.group({
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
        return this.loginForm.controls;
    }

    onSubmitForm() {
        this.submitted = true;
        if (this.loginForm.invalid) {
          return;
        }

        this.loading = true;
        this.authenticationService.login(this.form.username.value, this.form.password.value);
        this.dialogService.openDialog("Login Error", "Invalid username or password. Please try again!");
    }
}
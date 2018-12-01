import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;
    submitted: boolean = false;

    constructor(
        private authenticationService: AuthenticationService,
        private formBuilder : FormBuilder
    ) {

    }

    ngOnInit() {
        // this.loginForm = this.formBuilder.group({
        //     username: ['', Validators.required],
        //     password: ['', Validators.required]
        //   });
    }

    ngOnDestroy() {

    }

    get form() {
        return this.loginForm.controls;
    }

    onSubmitForm() {
        console.log("Successful.")
        // Authenticate via Ethereum.
    }
}
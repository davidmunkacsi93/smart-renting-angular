import { Component, OnInit, OnDestroy } from '@angular/core'
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
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService
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

    onSubmitForm() {
        console.log("Successful.")
        // Authenticate via Ethereum.
    }
}
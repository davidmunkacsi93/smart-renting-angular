import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthenticationService } from "src/app/core/services/authentication.service";
import { DialogService } from "src/app/core/services/dialog.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/core/store/state";
import { AddUserAction } from "../../core/actions/index";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  ngOnDestroy() {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
      "#0C374D";
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
    this.authenticationService
      .login(this.form.username.value, this.form.password.value)
      .then(user => {
        this.loading = false;
        this.router.navigate(["/home"], { skipLocationChange: false });
        console.log(user);
        this.store.dispatch(new AddUserAction(user));
      })
      .catch(_ => {
        this.loading = false;
        this.dialogService.openDialog(
          "Login Error",
          "Invalid username or password. Please try again!"
        );
      });
  }
}

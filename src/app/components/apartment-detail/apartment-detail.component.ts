import { Component, OnInit, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApartmentContract } from 'src/app/core/contracts/apartment.contract';
import { Apartment } from 'src/app/core/model/apartment';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotifierService } from 'angular-notifier';
import { WebSocketProvider } from 'src/app/core/providers/websocket.provider';
import { UserContract } from 'src/app/core/contracts/user.contract';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state';
import { RefreshBalanceAction } from 'src/app/core/actions';

@Component({
  selector: 'app-apartment-detail',
  templateUrl: './apartment-detail.component.html',
  styleUrls: ['./apartment-detail.component.scss']
})
export class ApartmentDetailComponent implements OnInit, AfterViewInit {

  private apartment : Apartment;
  private ownApartment : boolean;
  private loading: boolean;

  constructor(
    @Inject(WebSocketProvider) private socket : any,
    private notifierService : NotifierService,
    private elementRef : ElementRef,
    private route: ActivatedRoute,
    private apartmentContract: ApartmentContract,
    private userContract: UserContract,
    private store: Store<AppState>,
    private authenticationSerice : AuthenticationService
  ) { }

  ngOnInit() {
    var currentUser = this.authenticationSerice.getCurrentUser();

    this.route.params.subscribe(params => {
      var apartmentId = +params['id'];
      this.apartmentContract.getApartmentDetails(apartmentId).then(apartment => {
        this.apartment = apartment;
        this.ownApartment = apartment.Owner == currentUser.Address;
      });
    });
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#829356';
  }

  async rentApartment() {
    this.loading = true;
    this.apartmentContract.rentApartment(this.apartment)
    .then(async () => {
      this.socket.emit("payment", { to: this.apartment.Owner, amount: (this.apartment.Deposit + this.apartment.Rent) });
      var newBalance = await this.userContract.getCurrentUserBalance();
      console.log(newBalance);
      this.store.dispatch(new RefreshBalanceAction(newBalance));
      this.notifierService.notify("success", "Succesful payment!");
      this.loading = false;
    })
    .catch(exc => {
      this.notifierService.notify("error", exc);        
      this.loading = false;
    });
  }
}

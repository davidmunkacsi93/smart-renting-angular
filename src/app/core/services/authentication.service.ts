import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import { Web3Provider } from '../providers/web3.provider'
import { UserContract } from "../contracts/user.contract";
import { environment } from "../../../environments/environment";

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(Web3Provider) private provider : Web3,
    private userContract : UserContract
  ) {

  }

  public login(username: string, password: string): void {
  }

  public logout(): void {
  }

  public async register(username: string, password: string) {
    console.log(environment);
    var address = await this.provider.eth.personal.newAccount(password).then(address => {
      const transactionObject = {
        from: environment.ethereumMasterAccount,
        to: address
      }

      console.log(transactionObject);

      this.provider.eth.sendTransaction(transactionObject).then(reason => console.log(reason));
      this.provider.eth.personal.unlockAccount(address, password, 100);
      return address;
    });

    console.log(address);
    this.userContract.createUser(username, password, address)
    return address;
  }
};
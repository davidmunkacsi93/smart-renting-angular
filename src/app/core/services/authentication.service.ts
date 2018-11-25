import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import { Web3Provider } from '../providers/web3.provider'

@Injectable()
export class AuthenticationService {
  constructor(@Inject(Web3Provider) private provider : Web3) {}

  public getEthereumAccounts() {
    return this.provider.eth.getAccounts().then(accounts => accounts.forEach(acc => console.log(acc)));
  }
};
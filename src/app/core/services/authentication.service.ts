import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import { EthereumProvider } from '../providers/ethereum.provider'

@Injectable()
export class AuthenticationService {
  constructor(@Inject(EthereumProvider) private provider : Web3) {}

  public getEthereumAccounts() {
    return this.provider.eth.accounts;
  }
};
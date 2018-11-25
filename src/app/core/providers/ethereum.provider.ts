import { InjectionToken } from '@angular/core';
import Web3  from 'web3';
import { Provider } from 'web3/providers';
import { environment } from "../../../environments/environment";

export const EthereumProvider = new InjectionToken<Web3>('web3', {
  providedIn: 'root',
  factory: () => new Web3(environment.ethereumDevelopmentUrl)
});
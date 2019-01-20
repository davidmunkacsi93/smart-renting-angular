import { InjectionToken } from '@angular/core';
import Web3  from 'web3';
import { Provider } from 'web3/providers';
import { environment } from "../../../environments/environment";

export const Web3Provider = new InjectionToken<Web3>('web3', {
  providedIn: 'root',
  factory: () => {
    var provider = new Web3.providers.WebsocketProvider(environment.ethereumWsUrl);
    var web3 = new Web3(provider);
    console.log(web3);
    return web3;
  }
});
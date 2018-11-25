import { Injectable, Inject } from "@angular/core";
import { EthereumProvider } from '../providers/ethereum.provider'

@Injectable()
export class UserService {
  constructor(@Inject(EthereumProvider) private provider) {}

  public authenticate() {
  }
};
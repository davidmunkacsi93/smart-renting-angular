import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import { Web3Provider } from '../providers/web3.provider'
import { UserContract } from "../contracts/user.contract";

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

  public register(username: string, password: string) {
    this.userContract.createUser(username, password);
    return this.provider.eth.personal.newAccount(password)
  }
};
import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import { Web3Provider } from '../providers/web3.provider'
import { UserContract } from "../contracts/user.contract";
import { environment } from "../../../environments/environment";

const INITIAL_BALANCE = Math.pow(10, 15);

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
    var address = await this.provider.eth.personal.newAccount(password);
    this.provider.eth.personal.unlockAccount(address, password, 100);

    console.log(this.provider.utils.toWei(INITIAL_BALANCE.toString(), "ether"));

    const transactionObject = {
      from: environment.ethereumMasterAccount,
      to: address,
      value: INITIAL_BALANCE
    }

    // Transferring the new account initial balance;
    await this.provider.eth.sendTransaction(transactionObject);

    try  {
      const transactionReceipt = await this.userContract.createUser(username, password, address);
      console.log(transactionReceipt)
      return transactionReceipt.from;
    } catch (exc) {
      throw (exc)
    }

  }
};
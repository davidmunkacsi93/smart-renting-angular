import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import { Web3Provider } from '../providers/web3.provider'
import { UserContract } from "../contracts/user.contract";
import { environment } from "../../../environments/environment";

const INITIAL_BALANCE = Math.pow(10, 15);
const CURRENT_USER_KEY = 'currentUser';
const CURRENT_USER_ADDRESS_KEY = 'currentUserAddress';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(Web3Provider) private provider : Web3,
    private userContract : UserContract
  ) {

  }

  public isAuthenticated(): boolean {
    return localStorage.getItem(CURRENT_USER_KEY) !== null;
  }

  public async login(username: string, password: string) {
    const user = await this.userContract.authenticate(username, password);
    localStorage.setItem(CURRENT_USER_KEY, user.Username);
    localStorage.setItem(CURRENT_USER_ADDRESS_KEY, user.Address);
  }

  public logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_USER_ADDRESS_KEY);
  }

  public async register(username: string, password: string) {
    const isExisting = await this.userContract.isUsernameExisting(username);
    if (isExisting) {
      throw("Username already exists! Please choose another username.");
    }
    var address = await this.provider.eth.personal.newAccount(password);
    this.provider.eth.personal.unlockAccount(address, password, 100);

    const transactionObject = {
      from: environment.ethereumMasterAccount,
      to: address,
      value: INITIAL_BALANCE
    }

    // Transferring the new account initial balance;
    await this.provider.eth.sendTransaction(transactionObject);

    try  {
      const transactionReceipt = await this.userContract.createUser(username, password, address);
      return transactionReceipt.from;
    } catch (exc) {
      throw (exc)
    }
  }
};
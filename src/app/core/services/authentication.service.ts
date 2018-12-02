import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import { Web3Provider } from '../providers/web3.provider'
import { UserContract } from "../contracts/user.contract";
import { environment } from "../../../environments/environment";
import { User } from "../model/user";

const INITIAL_BALANCE = Math.pow(10, 15);
const CURRENT_USER_KEY = 'currentUser';


@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(Web3Provider) private provider : Web3,
    private userContract : UserContract
  ) {

  }

  public getCurrentUser() : User {
    var userJSON = localStorage.getItem(CURRENT_USER_KEY);
    if (userJSON === null) return null;

    var currentUser : User = JSON.parse(userJSON);
  }

  public getBalance(userAddress : string) {
    return this.provider.eth.getBalance(userAddress);
  }

  public isAuthenticated(): boolean {
    return localStorage.getItem(CURRENT_USER_KEY) !== null;
  }

  public async login(username: string, password: string) {
    const user = await this.userContract.authenticate(username, password);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  public logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
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
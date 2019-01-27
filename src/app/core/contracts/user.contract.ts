import { Injectable, Inject } from '@angular/core';
import Web3  from 'web3'
import { Web3Provider } from '../providers/web3.provider'
import Contract from 'web3/eth/contract';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { Web3Utils, ContractType } from '../utils/web3.utils';

@Injectable()
export class UserContract {
    private contract : Contract

    constructor(
        @Inject(Web3Provider) private provider : Web3,
        private providerUtils : Web3Utils
    ) {
        this.contract = this.providerUtils.getContract(ContractType.UserContract);
    }

    public async createUser(username : string, password : string, userAddress: string) {
        var estimatedGas = await this.contract.methods.createUser(username, password).estimateGas();
        return this.contract.methods.createUser(username, password).send(this.providerUtils.createTransaction(estimatedGas, userAddress));
    }

    public async isUsernameExisting(username: string) {
        var estimatedGas = await this.contract.methods.isUsernameExisting(username).estimateGas();
        return this.contract.methods.isUsernameExisting(username).call(this.providerUtils.createTransaction(estimatedGas, environment.ethereumMasterAccount));
    }

    public async getUsers() : Promise<User[]> {
        var accounts = await this.provider.eth.getAccounts();
        var currentUser = this.providerUtils.getCurrentUser();

        var users : User[] = [];
        var otherAccounts = accounts.filter(val => val !== currentUser.Address)

        await otherAccounts.forEach(async (account) => {
            var username = await this.getUsername(account);
            if (username == "") return;
            var user : User = {
                Address: account,
                Username: username,
                BalanceInEth: 0,
                BalanceInEur: 0
            }
            users.push(user);
        });

        return users;
    }

    public async authenticate(username: string, password: string) : Promise<User> {
        var estimatedGas = await this.contract.methods.authenticate(username, password).estimateGas();

        try  {
            var user = await this.contract.methods.authenticate(username, password).call(this.providerUtils.createTransaction(estimatedGas, environment.ethereumMasterAccount));
            if (user[0]) {
                var result = await this.parseUserResponse(user);
                this.provider.eth.personal.unlockAccount(result.Address, password, 1000);
                this.provider.eth.defaultAccount = result.Address;
                return result;
            }
            throw("Authentication not successful.");
        } catch (exc) {
            throw("Error during contacting the network. " + exc.message)
        }
    }

    public async getCurrentUserBalance()  : Promise<any> {
        var currentUser = this.providerUtils.getCurrentUser();
        var balanceInWei = await this.provider.eth.getBalance(currentUser.Address);
        var balanceInEthStr = this.provider.utils.fromWei(balanceInWei, "ether").toString();
        var balanceInEth = parseInt(balanceInEthStr);
        var balanceInEur = balanceInEth * this.providerUtils.EURO_RATE;
        return { balanceInEth, balanceInEur }
    }

    public async getUsername(address: string): Promise<string> {
        var estimatedGas = await this.contract.methods.getUsername(address).estimateGas();
        return this.contract.methods.getUsername(address).call(this.providerUtils.createTransaction(estimatedGas));
    }

    private async parseUserResponse(userResponse) : Promise<User> {
        var user : User = {
            Username: userResponse[1],
            Address: userResponse[2],
            BalanceInEth: 0,
            BalanceInEur: 0
        }

        var balanceInWei = await this.provider.eth.getBalance(user.Address);
        var balanceInEth = this.provider.utils.fromWei(balanceInWei, "ether").toString();
        user.BalanceInEth = parseInt(balanceInEth);
        user.BalanceInEur = user.BalanceInEth * this.providerUtils.EURO_RATE;

        return user;
    }
}
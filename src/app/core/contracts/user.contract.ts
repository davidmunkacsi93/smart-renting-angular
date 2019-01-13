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

    private EURO_RATE = 133.14

    constructor(
        @Inject(Web3Provider) private provider : Web3,
        private providerUtils : Web3Utils
    ) {
        this.contract = this.providerUtils.getContract(ContractType.UserContract);
    }

    public async createUser(username : string, password : string, userAddress: string) {
        var estimatedGas = await this.contract.methods.createUser(username, password).estimateGas();

        try  {
            var transactionReceipt = await this.contract.methods.createUser(username, password).send(this.providerUtils.createTransaction(estimatedGas, userAddress));
            return transactionReceipt;
        } catch (exc) {
            throw("Registration was not successful. " + exc.message)
        }
    }

    public async isUsernameExisting(username: string) {
        var estimatedGas = await this.contract.methods.isUsernameExisting(username).estimateGas();

        try  {
            var isExisting = await this.contract.methods.isUsernameExisting(username).call(this.providerUtils.createTransaction(estimatedGas, environment.ethereumMasterAccount));
            return isExisting;
        } catch (exc) {
            throw("Error during contacting the network. " + exc.message)
        }
    }

    public async authenticate(username: string, password: string) : Promise<User> {
        var estimatedGas = await this.contract.methods.authenticate(username, password).estimateGas();

        try  {
            var user = await this.contract.methods.authenticate(username, password).call(this.providerUtils.createTransaction(estimatedGas, environment.ethereumMasterAccount));
            if (user[0]) {
                var result = await this.parseUserResponse(user);
                this.provider.eth.personal.unlockAccount(result.Address, password, 1000);
                return result;
            }
            throw("Authentication not successful.");
        } catch (exc) {
            throw("Error during contacting the network. " + exc.message)
        }
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
        user.BalanceInEur = user.BalanceInEth * this.EURO_RATE;

        return user;
    }
}
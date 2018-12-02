import { Injectable, Inject } from '@angular/core';
import Web3  from 'web3'
import { Web3Provider } from '../providers/web3.provider'
import Contract from 'web3/eth/contract';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

@Injectable()
export class UserContract {
    private contract : Contract

    constructor(
        @Inject(Web3Provider) private provider : Web3
    ) {
        var userContractJson = require("../../../contracts-json/UserContract.json");
        var userContractABI = userContractJson.abi;
        for (var uKey in userContractJson.networks) {
            var userContractKey = uKey;
          }
        var userContractAddress = userContractJson.networks[userContractKey].address;
        this.contract = new provider.eth.Contract(userContractABI, userContractAddress);
    }

    public async createUser(username : string, password : string, userAddress: string) {
        var estimatedGas = await this.contract.methods.createUser(username, password).estimateGas();

        const transactionObject = {
            from: userAddress,
            gas: Math.round(estimatedGas*1.5),
            gasPrice: estimatedGas
        };

        try  {
            var transactionReceipt = await this.contract.methods.createUser(username, password).send(transactionObject);
            return transactionReceipt;
        } catch (exc) {
            throw("Registration was not successful. " + exc.message)
        }
    }

    public async isUsernameExisting(username: string) {
        var estimatedGas = await this.contract.methods.isUsernameExisting(username).estimateGas();

        const transactionObject = {
            from: environment.ethereumMasterAccount,
            gas: Math.round(estimatedGas*1.5),
            gasPrice: estimatedGas
        };

        try  {
            var isExisting = await this.contract.methods.isUsernameExisting(username).call(transactionObject);
            return isExisting;
        } catch (exc) {
            throw("Error during contacting the network. " + exc.message)
        }
    }

    public async authenticate(username: string, password: string) {
        var estimatedGas = await this.contract.methods.authenticate(username, password).estimateGas();

        const transactionObject = {
            from: environment.ethereumMasterAccount,
            gas: Math.round(estimatedGas*1.5),
            gasPrice: estimatedGas
        };

        try  {
            var user = await this.contract.methods.authenticate(username, password).call(transactionObject);
            if (user[0]) {
                return this.parseUserResponse(user);
            }
            throw("Authentication not successful.");
        } catch (exc) {
            throw("Error during contacting the network. " + exc.message)
        }
    }

    private parseUserResponse(userResponse) : User {
        return {
            Username: userResponse[1],
            Address: userResponse[2]
        }
    }
}
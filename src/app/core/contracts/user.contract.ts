import { Injectable, Inject } from '@angular/core';
import Web3  from 'web3'
import { Web3Provider } from '../providers/web3.provider'
import Contract from 'web3/eth/contract';

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
        console.log(this.contract);
    }

    public async createUser(username : string, password : string, userAddress: string) {
        var estimatedGas = await this.contract.methods.createUser(username, password).estimateGas();

        console.log(estimatedGas);

        const transactionObject = {
            from: userAddress,
            gas: 500000
        };

        this.contract.methods.createUser(username, password).send(transactionObject).then(result => console.log(result));
    }
}
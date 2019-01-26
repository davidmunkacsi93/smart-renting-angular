import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import Contract from "web3/eth/contract";
import { Web3Provider } from "../providers/web3.provider";
import { User } from "../model/user";

const CURRENT_USER_KEY = "currentUser";

export const enum ContractType {
    ApartmentContract, UserContract
}

export const enum PaymentType {
    Rent, Deposit, DepositBack
}

@Injectable()
export class Web3Utils {

    public EURO_RATE = 133.14;

    constructor(
        @Inject(Web3Provider) private provider : Web3
    ){}

    public getContract = (contractType : ContractType) : Contract  => {
        switch (contractType) {
            case ContractType.ApartmentContract:
                var contractJson = require("../../../contracts-json/ApartmentContract.json")
                break;
            case ContractType.UserContract:
                var contractJson = require("../../../contracts-json/UserContract.json")
                break;
        }
        var contractABI = contractJson.abi;
        for (var key in contractJson.networks) {
            var contractKey = key;
          }
        var contractAddress = contractJson.networks[contractKey].address;
        return new this.provider.eth.Contract(contractABI, contractAddress);
    }

    public getCurrentUser = () : User => {
        var userJSON = sessionStorage.getItem(CURRENT_USER_KEY);
        if (userJSON === null) return null;
        var currentUser : User = JSON.parse(userJSON);
        return currentUser;
    }

    public createTransaction =  (estimatedGas, address?) => {
        if (address === undefined) {
            var currentUser = this.getCurrentUser();
        }

        return {
            from: address === undefined ? currentUser.Address : address,
            gas: Math.round(estimatedGas*1.5),
            gasPrice: estimatedGas
        };
    }
}
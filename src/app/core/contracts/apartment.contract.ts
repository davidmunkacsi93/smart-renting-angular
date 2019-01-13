import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import Contract from "web3/eth/contract";
import { Web3Provider } from "../providers/web3.provider";
import { Apartment } from "../model/apartment";
import { AuthenticationService } from "../services/authentication.service";
import { TransactionObject } from "web3/eth/types";

@Injectable()
export class ApartmentContract {

    private contract : Contract;

    constructor(
        @Inject(Web3Provider) private provider : Web3,
        private authenticationService: AuthenticationService
    ) {
        var apartmentContractJson = require("../../../contracts-json/ApartmentContract.json");
        var apartmentContractABI = apartmentContractJson.abi;
        for (var aKey in apartmentContractJson.networks) {
            var apartmentContractKey = aKey;
          }
        var userContractAddress = apartmentContractJson.networks[apartmentContractKey].address;
        this.contract = new provider.eth.Contract(apartmentContractABI, userContractAddress);
    }

    public async createApartment(apartment : Apartment) {
        var estimatedGas = await this.callCreateApartment(apartment).estimateGas();
        var currentUser = this.authenticationService.getCurrentUser();

        const transactionObject = {
            from: currentUser.Address,
            gas: Math.round(estimatedGas*1.5),
            gasPrice: estimatedGas
        };

        try  {
            var transactionReceipt = await this.callCreateApartment(apartment).send(transactionObject);
            return transactionReceipt;
        } catch (exc) {
            throw("Creation of the apartment was not successful. " + exc.message)
        }
    }

    public async getApartmentIds() {
        var currentUser = this.authenticationService.getCurrentUser();
        var estimatedGas = await this.contract.methods.getApartments().estimateGas();

        const transactionObject = {
            from: currentUser.Address,
            gas: Math.round(estimatedGas*1.5),
            gasPrice: estimatedGas
        };

        return this.contract.methods.getApartmentIds().call(transactionObject);
    }

    public callCreateApartment(apartment : Apartment) : TransactionObject<any> {
        return this.contract.methods.createApartment(apartment.PostCode, apartment.City, apartment.Street, apartment.HouseNumber, apartment.Floor, apartment.Description,
            apartment.Rent, apartment.Deposit);
    }
}
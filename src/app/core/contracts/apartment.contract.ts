import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import Contract from "web3/eth/contract";
import { Web3Provider } from "../providers/web3.provider";
import { Apartment } from "../model/apartment";
import { AuthenticationService } from "../services/authentication.service";
import { TransactionObject } from "web3/eth/types";
import { Web3Utils, ContractType } from "../utils/web3.utils";

@Injectable()
export class ApartmentContract {

    private contract : Contract;

    constructor(
        @Inject(Web3Provider) private provider : Web3,
        private providerUtils : Web3Utils
    ) {
        this.contract = this.providerUtils.getContract(ContractType.ApartmentContract);
    }

    public async createApartment(apartment : Apartment) {
        var estimatedGas = await this.callCreateApartment(apartment).estimateGas();
        return this.callCreateApartment(apartment).send(this.providerUtils.createTransaction(estimatedGas));
    }

    public async getApartmentIds() {
        var estimatedGas = await this.contract.methods.getApartmentIds().estimateGas();
        return this.contract.methods.getApartmentIds().call(this.providerUtils.createTransaction(estimatedGas));
    }

    public async getApartmentDetails(apartmentId : number) {
        var estimatedGas = await this.contract.methods.getApartmentIds().estimateGas();
        return this.contract.methods.getApartmentById(apartmentId)
            .call(this.providerUtils.createTransaction(estimatedGas))
            .then(apartment => { return this.parseApartmentResponse(apartment); });
    }

    public callCreateApartment(apartment : Apartment) : TransactionObject<any> {
        return this.contract.methods.createApartment(apartment.PostCode, apartment.City, apartment.Street, apartment.HouseNumber, apartment.Floor, apartment.Description,
            apartment.Rent, apartment.Deposit);
    }

    private async parseApartmentResponse(apartmentResponse) : Promise<Apartment> {
        var apartment : Apartment = {
            Id: apartmentResponse[1],
            Owner: apartmentResponse[2],
            Tenant: apartmentResponse[3],
            PostCode: apartmentResponse[4],
            City: apartmentResponse[5],
            Street: apartmentResponse[6],
            HouseNumber: apartmentResponse[7],
            Floor: apartmentResponse[8],
            Description: apartmentResponse[9],
            Rent: apartmentResponse[10],
            Deposit: apartmentResponse[11],
            IsRented: apartmentResponse[12]
        }

        return apartment;
    }
}
import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import Contract from "web3/eth/contract";
import { Web3Provider } from "../providers/web3.provider";
import { Apartment } from "../model/apartment";
import { AuthenticationService } from "../services/authentication.service";
import { TransactionObject } from "web3/eth/types";
import { Web3Utils, ContractType } from "../utils/web3.utils";
import { UserContract } from "./user.contract";

@Injectable()
export class ApartmentContract {

    private apartmentContract : Contract;

    constructor(
        @Inject(Web3Provider) private provider : Web3,
        private providerUtils : Web3Utils,
        private userContract : UserContract
    ) {
        this.apartmentContract = this.providerUtils.getContract(ContractType.ApartmentContract);
    }

    public async createApartment(apartment : Apartment) {
        var estimatedGas = await this.callCreateApartment(apartment).estimateGas();
        return this.callCreateApartment(apartment).send(this.providerUtils.createTransaction(estimatedGas));
    }

    public async getApartmentIds() {
        var estimatedGas = await this.apartmentContract.methods.getApartmentIds().estimateGas();
        return this.apartmentContract.methods.getApartmentIds().call(this.providerUtils.createTransaction(estimatedGas));
    }

    public async getApartmentDetails(apartmentId : number) {
        var estimatedGas = await this.apartmentContract.methods.getApartmentIds().estimateGas();
        return this.apartmentContract.methods.getApartmentById(apartmentId)
            .call(this.providerUtils.createTransaction(estimatedGas))
            .then(apartment => { return this.parseApartmentResponse(apartment); });
    }

    public callCreateApartment(apartment : Apartment) : TransactionObject<any> {
        return this.apartmentContract.methods.createApartment(apartment.PostCode, apartment.City, apartment.Street, apartment.HouseNumber, apartment.Floor, apartment.Description,
            apartment.Rent, apartment.Deposit);
    }

    private async parseApartmentResponse(apartmentResponse) : Promise<Apartment> {
        var apartment : Apartment = {
            Id: parseInt(apartmentResponse[0]),
            Owner: apartmentResponse[1],
            OwnerName: "",
            Tenant: apartmentResponse[2],
            TenantName: "",
            PostCode: parseInt(apartmentResponse[3]),
            City: apartmentResponse[4],
            Street: apartmentResponse[5],
            HouseNumber: parseInt(apartmentResponse[6]),
            Floor: parseInt(apartmentResponse[7]),
            Description: apartmentResponse[8],
            Rent: parseInt(apartmentResponse[9]),
            Deposit: parseInt(apartmentResponse[10]),
            IsRented: apartmentResponse[11]
        }

        apartment.OwnerName = await this.userContract.getUsername(apartment.Owner);
        if (apartment.IsRented) {
            apartment.TenantName = await this.userContract.getUsername(apartment.TenantName);
        }

        return apartment;
    }
}
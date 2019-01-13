import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import Contract from "web3/eth/contract";
import { Web3Provider } from "../providers/web3.provider";
import { Apartment } from "../model/apartment";

@Injectable()
export class ApartmentContract {

    private contract : Contract;

    constructor(
        @Inject(Web3Provider) private provider : Web3
    ) {

    }

    public async createApartment(apartment : Apartment) {
        
    }
}
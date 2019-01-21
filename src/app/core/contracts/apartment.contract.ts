import { Injectable, Inject } from "@angular/core";
import Web3  from 'web3'
import Contract from "web3/eth/contract";
import { Web3Provider } from "../providers/web3.provider";
import { Apartment } from "../model/apartment";
import { AuthenticationService } from "../services/authentication.service";
import { TransactionObject } from "web3/eth/types";
import { Web3Utils, ContractType, PaymentType } from "../utils/web3.utils";
import { UserContract } from "./user.contract";
import { NotifierService } from "angular-notifier";
import { WebSocketProvider } from "../providers/websocket.provider";

@Injectable()
export class ApartmentContract {

    private apartmentContract : Contract;

    constructor(
        @Inject(Web3Provider) private provider : Web3,
        @Inject(WebSocketProvider) private socket : any,
        private providerUtils : Web3Utils,
        private userContract : UserContract,
        private notifierService: NotifierService
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

    public async getApartmentIdsByAddress(address : string) {
        var estimatedGas = await this.apartmentContract.methods.getApartmentIds().estimateGas();
        return this.apartmentContract.methods.getApartmentIds().call(this.providerUtils.createTransaction(estimatedGas, address));
    }

    public async getApartmentDetails(apartmentId) {
        var estimatedGas = await this.apartmentContract.methods.getApartmentIds().estimateGas();
        return this.apartmentContract.methods.getApartmentById(apartmentId)
            .call(this.providerUtils.createTransaction(estimatedGas))
            .then(apartment => { return this.parseApartmentResponse(apartment); });
    }

    public async transferAmount(from: string, to: string, amount: number, paymentType: PaymentType) {
        var amountInEther = (amount / this.providerUtils.EURO_RATE).toString();
        var amountInWei = this.provider.utils.toWei(amountInEther, "ether");

        const transactionObject = {
          from: from,
          to: to,
          value: amountInWei
        };
        return this.provider.eth.sendTransaction(transactionObject)
    }

    public async rentApartment(apartment: Apartment) {
        var currentUser = this.providerUtils.getCurrentUser();

        if (currentUser.BalanceInEur < (apartment.Deposit + apartment.Rent)) {
            throw "Insufficient funds.";
        }

        return this.transferAmount(currentUser.Address, apartment.Owner, apartment.Deposit, PaymentType.Deposit)
        .then(() => {
            this.notifierService.notify("success", "Transferring " + apartment.Deposit + " € deposit successful.");

            return this.transferAmount(currentUser.Address, apartment.Owner, apartment.Rent, PaymentType.Rent)
            .then(async () => {
                this.notifierService.notify("success", "Transferring " + apartment.Rent + " € rent successful.");
            })
            .catch(async () => {
                await this.transferAmount(apartment.Owner, currentUser.Address,  apartment.Deposit, PaymentType.Deposit)
                this.notifierService.notify("error", "Transferring rent not successful. Payment cancelled.");
            });
        })
        .catch((exc) => {
            console.log(exc);
            this.notifierService.notify("error", "Transferring deposit not successful. Payment cancelled.");
        });
    }

    public callCreateApartment(apartment : Apartment) : TransactionObject<any> {
        return this.apartmentContract.methods.createApartment(apartment.PostCode, apartment.City, apartment.Street, apartment.HouseNumber, apartment.Floor, apartment.Description,
            apartment.Rent, apartment.Deposit);
    }

    public async getAvailableApartments() : Promise<Apartment[]> {
        var accounts = await this.provider.eth.getAccounts();
        var currentUser = this.providerUtils.getCurrentUser();

        var availableApartments = [];
        var otherAccounts = accounts.filter(val => val !== currentUser.Address)
        
        await otherAccounts.forEach(async (account) => {
            var apartmentIds = await this.getApartmentIdsByAddress(account);

            await apartmentIds.forEach(async (apartmentId) => {
                var apartment = await this.getApartmentDetails(apartmentId);
                if (apartment.IsRented === false) {
                    availableApartments.push(apartment);
                }
            });
        });

        return availableApartments;
    }

    public async firePaymentEvent(to, amount) {
        this.socket.emit("payment", { to: to, amount: amount });
    }

    public getContract() : Contract {
        return this.apartmentContract;
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
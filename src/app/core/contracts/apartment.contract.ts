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
import { ApartmentTransaction } from "../model/apartmentTransaction";

@Injectable()
export class ApartmentContract {

    private apartmentContract : Contract;

    constructor(
        @Inject(Web3Provider) private provider : Web3,
        private providerUtils : Web3Utils,
        private userContract : UserContract,
        private notifierService: NotifierService
    ) {
        this.apartmentContract = this.providerUtils.getContract(ContractType.ApartmentContract);
    }

    public async createApartment(apartment: Apartment) {
        var estimatedGas = await this.callCreateApartment(apartment).estimateGas();
        return this.callCreateApartment(apartment).send(this.providerUtils.createTransaction(estimatedGas));
    }

    public async createTransaction(apartmentId: number, transactionMessage: string) {
        var estimatedGas = await this.apartmentContract.methods.createTransaction(apartmentId, transactionMessage).estimateGas();
        return this.apartmentContract.methods.createTransaction(apartmentId, transactionMessage)
            .send(this.providerUtils.createTransaction(estimatedGas));
    }

    public async getApartmentIds() {
        var estimatedGas = await this.apartmentContract.methods.getApartmentIds().estimateGas();
        return this.apartmentContract.methods.getApartmentIds().call(this.providerUtils.createTransaction(estimatedGas));
    }

    public async getApartmentIdsByAddress(address : string) {
        var estimatedGas = await this.apartmentContract.methods.getApartmentIds().estimateGas();
        return this.apartmentContract.methods.getApartmentIds().call(this.providerUtils.createTransaction(estimatedGas, address));
    }

    public async getRentedApartmentIds() {
        var estimatedGas = await this.apartmentContract.methods.getRentedApartments().estimateGas();
        return this.apartmentContract.methods.getRentedApartments().call(this.providerUtils.createTransaction(estimatedGas));
    }

    public async getApartmentDetails(apartmentId) {
        var estimatedGas = await this.apartmentContract.methods.getApartmentIds().estimateGas();
        return this.apartmentContract.methods.getApartmentById(apartmentId)
            .call(this.providerUtils.createTransaction(estimatedGas))
            .then(apartment => { return this.parseApartmentResponse(apartment); })
    }

    public async getApartmentTransactionIds(apartmentId) {
        var estimatedGas = await this.apartmentContract.methods.getTransactionIds(apartmentId).estimateGas();
        return this.apartmentContract.methods.getTransactionIds(apartmentId)
            .call(this.providerUtils.createTransaction(estimatedGas));
    }

    public async getApartmentTransactionDetail(transactionId) : Promise<ApartmentTransaction> {
        var estimatedGas = await this.apartmentContract.methods.getTransactionById(transactionId).estimateGas();
        return this.apartmentContract.methods.getTransactionById(transactionId)
            .call(this.providerUtils.createTransaction(estimatedGas))
            .then(apartmentTransaction => { 
                return this.parseApartmentTransactionResponse(apartmentTransaction);
            });
    }

    public async getApartmentTransaction(apartmentId) : Promise<ApartmentTransaction[]> {
        var apartmentTransactions = [];
        await this.getApartmentTransactionIds(apartmentId)
            .then(async apartmentTransactionIds => {
                await apartmentTransactionIds.forEach(async (apartmentTransactionId) => {
                    var apartmentTransaction = await this.getApartmentTransactionDetail(apartmentTransactionId);
                    apartmentTransactions.push(apartmentTransaction);
                });
            });

        return apartmentTransactions;
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

    public async getRentedApartments() : Promise<Apartment[]> {
        var apartmentIds = await this.getRentedApartmentIds();
        var rentedApartments = [];

        await apartmentIds.forEach(async (apartmentId) => {
            var apartment = await this.getApartmentDetails(apartmentId);
            rentedApartments.push(apartment);
        });

        return rentedApartments;
    }

    public async updateApartment(apartmentId: number) {
        var estimatedGas = await this.apartmentContract.methods.updateApartment(apartmentId).estimateGas();
        return this.apartmentContract.methods.updateApartment(apartmentId)
            .send(this.providerUtils.createTransaction(estimatedGas));
    }

    public async transferAmount(apartmentId: number, from: string, to: string, amount: number, paymentType: PaymentType) {
        var amountInEther = (amount / this.providerUtils.EURO_RATE).toString();
        var amountInWei = this.provider.utils.toWei(amountInEther, "ether");
        var currentUser = this.providerUtils.getCurrentUser();

        const transactionObject = {
          from: from,
          to: to,
          value: amountInWei
        };
        return this.provider.eth.sendTransaction(transactionObject)
        .then(async () => {
            switch (paymentType) {
                case PaymentType.Deposit:
                    await this.createTransaction(apartmentId, currentUser.Username + " transferred the deposit of " + amount + " €.")
                    break;
                case PaymentType.DepositBack:
                    await this.createTransaction(apartmentId, currentUser.Username + " transferred back the deposit of " + amount + " €.")
                    break;
                case PaymentType.Rent:
                    await this.createTransaction(apartmentId, currentUser.Username + " transferred the rent of " + amount + " €.")
                    break;
            }
        })
    }

    public async rentApartment(apartment: Apartment) {
        var currentUser = this.providerUtils.getCurrentUser();

        if (currentUser.BalanceInEur < (apartment.Deposit + apartment.Rent)) {
            throw "Insufficient funds.";
        }

        return this.transferAmount(apartment.Id, currentUser.Address, apartment.Owner, apartment.Deposit, PaymentType.Deposit)
        .then(() => {
            this.notifierService.notify("success", "Transferring " + apartment.Deposit + " € deposit successful.");

            return this.transferAmount(apartment.Id, currentUser.Address, apartment.Owner, apartment.Rent, PaymentType.Rent)
            .then(async () => {
                this.notifierService.notify("success", "Transferring " + apartment.Rent + " € rent successful.");
            })
            .catch(async () => {
                await this.transferAmount(apartment.Id, apartment.Owner, currentUser.Address,  apartment.Deposit, PaymentType.DepositBack)
                this.notifierService.notify("error", "Transferring rent not successful. Payment cancelled.");
            });
        })
        .catch(exc => {
            console.log(exc);
            this.notifierService.notify("error", "Transferring deposit not successful. Payment cancelled.");
        });
    }

    public async terminateContract(apartment: Apartment) {
        var estimatedGas = await this.apartmentContract.methods.terminateContract(apartment.Id, apartment.TenantName + " terminated the contract.")
            .estimateGas();
        return this.apartmentContract.methods.terminateContract(apartment.Id, apartment.TenantName + " terminated the contract.")
            .send(this.providerUtils.createTransaction(estimatedGas))
            .then(async () => {
                await this.transferAmount(apartment.Id, apartment.Owner, apartment.Tenant,  apartment.Deposit, PaymentType.DepositBack)
                .then(() => {
                    this.notifierService.notify("info", apartment.Owner + " transferred the deposit back.");
                });
            });
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
            apartment.TenantName = await this.userContract.getUsername(apartment.Tenant);
        }

        return apartment;
    }

    private parseApartmentTransactionResponse(apartmentTransactionResponse) : ApartmentTransaction {
        var parsedDate = new Date(parseInt(apartmentTransactionResponse[3])*1000);
        var apartmentTransaction : ApartmentTransaction = {
            Id: parseInt(apartmentTransactionResponse[0]),
            ApartmentId: parseInt(apartmentTransactionResponse[1]),
            Message: apartmentTransactionResponse[2],
            Timestamp: parsedDate.toLocaleDateString() + " " + parsedDate.toLocaleTimeString()
        }

        return apartmentTransaction;
    }
}
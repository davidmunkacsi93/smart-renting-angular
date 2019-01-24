// solium-disable linebreak-style
pragma solidity ^0.4.23;

contract ApartmentContract {
    uint32 private apartmentCounter = 0;
    mapping(address => uint32[]) apartments;
    mapping(address => uint32[]) rentedApartments;
    mapping(uint32 => uint32[]) apartmentTransactionMappings;
    
    mapping(uint32 => ApartmentDetail) apartmentDetails;
    mapping(uint32 => ApartmentTransaction) apartmentTransactions;

    constructor() public {
    }

    struct ApartmentDetail {
        uint32 id;
        address owner;
        address tenant;
        uint32 postCode;
        string city;
        string street;
        uint32 houseNumber;
        uint32 floor;
        string description;
        uint32 rent;
        uint32 deposit;
        bool isRented;
    }

    struct ApartmentTransaction {
        uint32 id;
        uint32 apartmentId;
        string message;
        uint timestamp;
    }

    function getId() private returns(uint32) {
        return apartmentCounter++;
    }

    // Create functions.
    function createApartment(
        uint32 _postCode, string _city, string _street,
        uint32 _houseNumber, uint32 _floor, string _description, uint32 _rent,
        uint32 _deposit) public {

        uint32 apartmentId = getId();
        ApartmentDetail memory apartment = ApartmentDetail(
            apartmentId, msg.sender, address(0),
            _postCode, _city, _street, _houseNumber, _floor, _description, _rent, _deposit, false);
        apartments[msg.sender].push(apartmentId);
        apartmentDetails[apartmentId] = apartment;
    }

    function createTransaction(uint32 _apartmentId, string _transactionMessage) public {
        uint32 transactionId = getId();
        ApartmentTransaction memory transaction = ApartmentTransaction(transactionId, _apartmentId, _transactionMessage, now);
        apartmentTransactionMappings[_apartmentId].push(transactionId);
        apartmentTransactions[transactionId] = transaction;
    }

    // Read functions.
    function getApartmentIds() public view returns(uint32[]) {
        return apartments[msg.sender];
    }

    function getRentedApartments() public view returns(uint32[]) {
        return rentedApartments[msg.sender];
    }

    function getApartmentById(uint32 apartmentId) public view returns(uint32 _id, address _owner, address _tenant,
        uint32 _postCode, string _city, string _street,
        uint32 _houseNumber, uint32 _floor, string _description, uint32 _rent, uint32 _deposit, bool _isRented) {
        ApartmentDetail storage a = apartmentDetails[apartmentId];
        return (a.id, a.owner, a.tenant, a.postCode, a.city, a.street, a.houseNumber, a.floor, a.description, a.rent, a.deposit, a.isRented);
    }

    function getTransactionIds(uint32 apartmentId) public view returns(uint32[]) {
        return apartmentTransactionMappings[apartmentId];
    }

    function getTransactionById(uint32 transactionId) public view returns(uint32 _id, uint32 _apartmentId, string _message, uint _timestamp) {
        ApartmentTransaction storage t = apartmentTransactions[transactionId];
        return (t.id, t.apartmentId, t.message, t.timestamp);
    }

    // Update functions.
    function updateApartment(uint32 _apartmentId, address _tenant) public {
        if (apartmentDetails[_apartmentId].isRented == false) {
            apartmentDetails[_apartmentId].tenant = _tenant;
            apartmentDetails[_apartmentId].isRented = true;
            rentedApartments[_tenant].push(_apartmentId);
        }
        createTransaction(_apartmentId, "The owner approved the rent.");
    }
}
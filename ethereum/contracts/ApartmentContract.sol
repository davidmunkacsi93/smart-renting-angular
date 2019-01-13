// solium-disable linebreak-style
pragma solidity ^0.4.23;

contract ApartmentContract {
    uint32 private apartmentCounter = 0;
    mapping(address => uint32[]) apartments;
    mapping(uint32 => ApartmentDetail) apartmentDetails;

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

    function getId() private returns(uint32) {
        return apartmentCounter++;
    }

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

    function getApartmentIds() public view returns(uint32[]) {
        return apartments[msg.sender];
    }
}
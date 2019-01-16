// solium-disable linebreak-style
pragma solidity ^0.4.23;

contract UserContract {

    struct User {
        string username;
        bytes32 password;
        address userAddress;
    }

    mapping (bytes32 => User) userMapping;
    mapping (bytes32 => bool) userExists;
    mapping (address => string) usernameMapping;

    function createUser(string memory username, string memory password) public {
        User memory user = User(username, keccak256(abi.encode(password)), msg.sender);
        bytes32 usernameHash = keccak256(abi.encode(username));
        userMapping[usernameHash] = user;
        userExists[usernameHash] = true;
        usernameMapping[msg.sender] = username;
    }

    function authenticate(string memory username, string memory password)
        public view returns (bool _success, string memory _username, address _userAddress) {

        bytes32 usernameHash = keccak256(abi.encode(username));
        if (userMapping[usernameHash].password == keccak256(abi.encode(password))) {
            User storage user = userMapping[usernameHash];
            return (true, user.username, user.userAddress);
        }

        return (false, "", address(0));
    }

    function isUsernameExisting(string memory username) public view returns (bool) {
        bytes32 usernameHash = keccak256(abi.encode(username));
        return userExists[usernameHash];
    }

    function getUsername(address userAddress) public view returns (string) {
        return usernameMapping[userAddress];
    }
}
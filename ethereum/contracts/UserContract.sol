// solium-disable linebreak-style
pragma solidity ^0.5.0;

contract UserContract {

    struct User {
        string username;
        bytes32 password;
        address userAddress;
    }

    mapping (string => User) userMapping;

    function createUser(string memory username, string memory password) public {
        User memory user = User(username, keccak256(abi.encode(password)), msg.sender);
        userMapping[username] = user;
    }

    function authenticate(string memory username, string memory password)
        public view returns (string memory _username, address _userAddress) {

        if (userMapping[username].password == keccak256(abi.encode(password))) {
            User storage user = userMapping[username];
            return (user.username, user.userAddress);
        }
    }

    function validateUsername(string memory _username) public returns (bool) {
        return true;
    }
}
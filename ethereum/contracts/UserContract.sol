// solium-disable linebreak-style
pragma solidity ^0.5.0;

contract UserContract {

    struct User {
        string username;
        bytes32 password;
        address userAddress;
        bool isExisting;
    }

    mapping (string => User) userMapping;

    function createUser(string memory username, string memory password) public {
        User memory user = User(username, keccak256(abi.encode(password)), msg.sender, true);
        userMapping[username] = user;
    }

    function authenticate(string memory username, string memory password)
        public view returns (bool _success, string memory _username, address _userAddress) {

        if (userMapping[username].password == keccak256(abi.encode(password))) {
            User storage user = userMapping[username];
            return (true, user.username, user.userAddress);
        }

        return (false, "", address(0));
    }

    function isUsernameExisting(string memory username) public view returns (bool) {
        if (userMapping[username].isExisting) return false;
        return true;
    }
}
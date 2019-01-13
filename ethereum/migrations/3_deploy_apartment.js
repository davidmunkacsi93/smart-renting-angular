var ApartmentContract = artifacts.require("./ApartmentContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ApartmentContract);
};
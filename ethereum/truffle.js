var host = require("../package.json").host;

module.exports = {
  networks: {
    development: {
      host: host,
      port: 8545,
      from: "0x8ade7d546792c1964c8bbc1b100c35bea8a01cd2",
      network_id: "5",
      gas: 4700000
    }
  }
};

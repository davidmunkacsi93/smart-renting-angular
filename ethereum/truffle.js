var config = require("../package.json");

module.exports = {
  networks: {
    development: {
      host: config.ethereumHost,
      port: config.ethereumPort,
      from: config.ethereumMasterAccount,
      network_id: "5",
      gas: 4700000
    }
  }
};

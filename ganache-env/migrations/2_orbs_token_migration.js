const OrbsToken = artifacts.require('OrbsToken');

module.exports = function(deployer, network, accounts) {
  const account = accounts[0];
  deployer.deploy(OrbsToken, account);
};

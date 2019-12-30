const StakingContract = artifacts.require('StakingContract');
const OrbsTokenJSON = require('../build/contracts/OrbsToken.json');

module.exports = function(deployer, network, accounts) {
  console.log(network);
  const cooldownPeriodInSec = 60;
  const mainAccount = accounts[0];
  const migrationManager = mainAccount;
  const emergencyManager = mainAccount;
  const OrbsTokenAddress = OrbsTokenJSON.networks['5777'].address;
  deployer.deploy(StakingContract, cooldownPeriodInSec, migrationManager, emergencyManager, OrbsTokenAddress);
};

const StakingContract = artifacts.require('StakingContract');
const OrbsToken = artifacts.require('OrbsToken');

module.exports = function(deployer, network, accounts) {
  console.log('Orbs token address', OrbsToken.address);

  const cooldownTimeInSeconds = 60 * 1 * 5;
  const account = accounts[0];

  const migrationManager = account;
  const emergencyManager = account;
  const erc20 = OrbsToken.address;

  deployer.deploy(StakingContract, cooldownTimeInSeconds, migrationManager, emergencyManager, erc20);
};

/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

const OrbsRewardsDistributionContract = artifacts.require('OrbsRewardsDistribution');
const OrbsToken = artifacts.require('OrbsToken');

module.exports = function (deployer) {
  const erc20 = OrbsToken.address;
  deployer.deploy(OrbsRewardsDistributionContract, erc20);
};

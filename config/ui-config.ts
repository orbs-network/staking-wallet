import { ReactComponent as EthereumNotCommitteeGuardianShield } from '../assets/chains/ethereum/guardian_no_committee.svg';
import { ReactComponent as EthereumCertifiedNotCommitteeGuardianShield } from '../assets/chains/ethereum/guardian_no_committee_certified.svg';
import { ReactComponent as EthereumCommitteeGuardianShield } from '../assets/chains/ethereum/guardian_committe.svg';
import { ReactComponent as EthereumCertifiedCommitteeGuardianShield } from '../assets/chains/ethereum/guardian_committee_certiied.svg';

import { ReactComponent as PolygonNotCommitteeGuardianShield } from '../assets/chains/polygon/guardian_no_committee.svg';
import { ReactComponent as PolygonCertifiedNotCommitteeGuardianShield } from '../assets/chains/polygon/guardian_no_committee_certified.svg';
import { ReactComponent as PolygonCommitteeGuardianShield } from '../assets/chains/polygon/guardian_committe.svg';
import { ReactComponent as PolygonCertifiedCommitteeGuardianShield } from '../assets/chains/polygon/guardian_committee_certiied.svg';
import { ReactComponent as PolygonLink } from '../assets/chains/polygon/link.svg';
import { ReactComponent as EthereumLink } from '../assets/chains/ethereum/link.svg';
import { ReactComponent as EthereumCopy } from '../assets/chains/ethereum/copy.svg';
import { ReactComponent as PolygonCopy } from '../assets/chains/polygon/copy.svg';

import { ReactComponent as PolygonNavbarChainLogo } from '../assets/chains/polygon/navbar-logo.svg';
import { ReactComponent as EthereumNavbarChainLogo } from '../assets/chains/ethereum/navbar-logo.svg';

import EthereumNavbarEllipsis from '../assets/chains/ethereum/shape.png';
import PolygonNavbarEllipsis from '../assets/chains/polygon/shape.png';

import { ReactComponent as EthereumTetraLogo } from '../assets/chains/ethereum/tetra-logo.svg';
import { ReactComponent as PolygonTetraLogo } from '../assets/chains/polygon/tetra-logo.svg';


import { CHAINS } from '../src/constants';

const uiConfig = {
  [CHAINS.ethereum]: {
    guardians: {
      nonCommitttee: EthereumNotCommitteeGuardianShield,
      certifiedNotCommittee: EthereumCertifiedNotCommitteeGuardianShield,
      committee: EthereumCommitteeGuardianShield,
      certifiedCommittee: EthereumCertifiedCommitteeGuardianShield,
    },
    linkImage: EthereumLink,
    copyImage: EthereumCopy,
    navbar: {
      chainLogo: EthereumNavbarChainLogo,
      ellipsis: EthereumNavbarEllipsis,
      logo: EthereumTetraLogo
    }
  },
  [CHAINS.polygon]: {
    guardians: {
      nonCommitttee: PolygonNotCommitteeGuardianShield,
      certifiedNotCommittee: PolygonCertifiedNotCommitteeGuardianShield,
      committee: PolygonCommitteeGuardianShield,
      certifiedCommittee: PolygonCertifiedCommitteeGuardianShield,
    },
    linkImage: PolygonLink,
    copyImage: PolygonCopy,
    navbar: {
      chainLogo: PolygonNavbarChainLogo,
      ellipsis: PolygonNavbarEllipsis,
      logo: PolygonTetraLogo
    }
  },
};

export {uiConfig};

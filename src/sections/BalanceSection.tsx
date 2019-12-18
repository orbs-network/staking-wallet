import React from 'react';
import { observer } from 'mobx-react';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';

export const BalanceSection = observer(() => {
  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={'BALANCE'} icon={AccountBalanceIcon} />
    </Section>
  );
});

import React from 'react';
import { observer } from 'mobx-react';

import StarIcon from '@material-ui/icons/Star';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';

export const RewardsSection = observer(() => {
  return (
    <Section>
      <SectionHeader title={'REWARDS'} icon={StarIcon} />
    </Section>
  );
});

import React from 'react';
import { observer } from 'mobx-react';

import SecurityIcon from '@material-ui/icons/Security';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { Guardians } from '../components/Guardians';

export const GuardiansSection = observer(() => {
  return (
    <Section>
      <SectionHeader title={'ALL GUARDIANS'} icon={SecurityIcon} />
      <Guardians/>
    </Section>
  );
});

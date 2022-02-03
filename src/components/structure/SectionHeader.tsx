import Grid from '@material-ui/core/Grid';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import React, { CSSProperties, ReactNode, SVGProps, useMemo } from 'react';
import styled from 'styled-components';
import SvgIcon from '@material-ui/core/SvgIcon';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { GridJustification } from '@material-ui/core/Grid/Grid';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { TypographyTypeMap } from '@material-ui/core/Typography/Typography';
import { Variant } from '@material-ui/core/styles/createTypography';

const SectionHeaderGrid = styled<typeof Grid>((props) => (
  <Grid item container direction={'row'} alignItems={'center'} {...props} />
))(() => ({
  // DEV_NOTE : This negates the 'section' spacing for sideways padding
  paddingRight: 0,
  paddingLeft: 0,
}));

const Title = styled(Typography)`
  margin-left: 0.5em;
  text-transform: uppercase;
`;

const SideTitle = styled(Typography)<OverridableComponent<TypographyTypeMap>>`
  margin-right: 0.5em;
  text-align: right;
`;

interface IProps {
  title: string;
  sideTitle?: string[] | string;
  icon: React.ElementType<SVGProps<SVGSVGElement>>;
  bottomPadding?: boolean;
  sideComponent?: ReactNode;
}

export const SectionHeader: React.FC<IProps> = (props) => {
  const { title, sideTitle, icon: MyIcon, bottomPadding, sideComponent } = props;

  const theme = useTheme();
  const largerThanMedium = useMediaQuery(theme.breakpoints.up('md'));

  const sidTitleComponent = useMemo(() => {
    if (!sideTitle) {
      return null;
    }

    const textsArray = Array.isArray(sideTitle) ? sideTitle : [sideTitle];

    const justification: GridJustification = largerThanMedium ? 'flex-end' : 'flex-start';
    // DEV_NOTE : '34px' is the width of the icon
    const extraMarginStyle: CSSProperties = largerThanMedium ? {} : { marginLeft: '34px' };
    const typographyVariant: Variant = largerThanMedium ? 'h6' : 'subtitle1';
    return (
      <Grid container item direction={'row'} sm={12} md={8} justify={justification} spacing={2}>
        {textsArray.map((text) => (
          <Grid item key={text}>
            <SideTitle key={text} variant={typographyVariant} style={extraMarginStyle}>
              {text}
            </SideTitle>
          </Grid>
        ))}
      </Grid>
    );
  }, [sideTitle, largerThanMedium]);

  const extraStyleForHeaderGrid = useMemo<CSSProperties>(() => {
    if (bottomPadding) {
      return {
        paddingBottom: '1em',
      };
    } else {
      return {};
    }
  }, [bottomPadding]);

  return (
    <SectionHeaderGrid style={extraStyleForHeaderGrid} spacing={1}>
      <Grid container item sm={12} md={4} direction={'row'} alignItems={'center'}>
        <SvgIcon component={MyIcon} />
        <Title variant={'h6'}>{title}</Title>
      </Grid>
      {sideComponent ? sideComponent : sidTitleComponent}
    </SectionHeaderGrid>
  );
};

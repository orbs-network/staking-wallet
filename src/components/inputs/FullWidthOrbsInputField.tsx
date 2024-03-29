import React from 'react';
import { NumberFormatCustom } from './NumberFormatInput';
import { TextField } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

interface IProps {
  id: string;
  label?: string;
  value: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
  placeholder?: string;
  customStyle?: CSSProperties;
  buttonComponent?: any;
}

export const FullWidthOrbsInputField = React.memo<IProps>((props) => {
  const { id, label, value, onChange, disabled, placeholder, customStyle, buttonComponent } = props;
  const theme = useTheme();

  const largerThanSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const fontSize = largerThanSmall ? theme.typography.h2.fontSize : theme.typography.h3.fontSize;
  const inputStyle = {
    width: '100%',
  };
  const style: CSSProperties = customStyle ? { ...inputStyle, ...customStyle } : inputStyle;
  
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        inputComponent: NumberFormatCustom as any,
        inputProps: {
          buttonComponent: buttonComponent,
          fontSize: fontSize,
          value: props.value,
        },
      }}
      disabled={disabled}
      style={style}
    />
  );
});

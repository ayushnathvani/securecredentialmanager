import { StyleSheet } from 'react-native';
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadowStyles,
} from '../../../utils';

export const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyles.small,
  },
  text: {
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadowStyles,
} from '../../../utils';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  elevation = 'medium',
}) => {
  const shadowStyle =
    elevation === 'small'
      ? shadowStyles.small
      : elevation === 'large'
      ? shadowStyles.large
      : shadowStyles.medium;

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, shadowStyle, style]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, shadowStyle, style]}
      activeOpacity={1}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
  },
});

export default Card;

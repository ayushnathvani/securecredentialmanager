import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../utils';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: Math.min(width - 48, 600),
    height: 180,
    backgroundColor: '#eee',
  },
});

export default styles;

// import { StyleSheet } from 'react-native';
// import { colors, spacing, fontSize, borderRadius } from '../../utils';

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: spacing.lg,
//   },
//   content: {
//     padding: spacing.lg,
//     paddingBottom: spacing.xxxl,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: spacing.xl,
//     marginTop: spacing.lg,
//   },
//   headerEmoji: {
//     fontSize: 72,
//     marginBottom: spacing.md,
//   },
//   title: {
//     fontSize: fontSize.xxxl,
//     fontWeight: 'bold',
//     color: colors.text,
//     marginBottom: spacing.sm,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: fontSize.base,
//     color: colors.textSecondary,
//     textAlign: 'center',
//     marginBottom: spacing.lg,
//   },
//   welcomeCard: {
//     backgroundColor: colors.primary + '10',
//     borderLeftWidth: 4,
//     borderLeftColor: colors.primary,
//     marginBottom: spacing.xl,
//   },
//   welcomeTitle: {
//     fontSize: fontSize.xl,
//     fontWeight: '700',
//     color: colors.primary,
//     marginBottom: spacing.sm,
//   },
//   welcomeText: {
//     fontSize: fontSize.md,
//     color: colors.text,
//     lineHeight: 22,
//   },
//   infoCard: {
//     backgroundColor: colors.success + '10',
//     borderLeftWidth: 4,
//     borderLeftColor: colors.success,
//     marginBottom: spacing.xl,
//   },
//   infoTitle: {
//     fontSize: fontSize.xl,
//     fontWeight: '700',
//     color: colors.success,
//     marginBottom: spacing.md,
//   },
//   infoText: {
//     fontSize: fontSize.md,
//     color: colors.text,
//     lineHeight: 24,
//   },
//   actionCard: {
//     backgroundColor: colors.surface,
//     marginBottom: spacing.xl,
//   },
//   actionTitle: {
//     fontSize: fontSize.xl,
//     fontWeight: '700',
//     color: colors.text,
//     marginBottom: spacing.md,
//   },
//   logoutButton: {
//     marginTop: spacing.md,
//     width: '60%',
//   },
//   biometricButton: {
//     marginTop: spacing.md,
//   },
//   demosContainer: {
//     marginBottom: spacing.xl,
//   },
//   sectionTitle: {
//     fontSize: fontSize.xl,
//     fontWeight: '700',
//     color: colors.text,
//     marginBottom: spacing.md,
//   },
//   demoCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: spacing.lg,
//     marginBottom: spacing.md,
//   },
//   iconContainer: {
//     width: 56,
//     height: 56,
//     borderRadius: borderRadius.md,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: spacing.md,
//   },
//   cardIcon: {
//     fontSize: 32,
//   },
//   cardContent: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: fontSize.lg,
//     fontWeight: '700',
//     marginBottom: spacing.xs,
//   },
//   cardDescription: {
//     fontSize: fontSize.sm,
//     color: colors.textSecondary,
//     lineHeight: 18,
//   },
//   arrow: {
//     fontSize: fontSize.xxxl,
//     color: colors.textLight,
//     fontWeight: '300',
//   },
//   featuresCard: {
//     backgroundColor: colors.success + '10',
//     borderLeftWidth: 4,
//     borderLeftColor: colors.success,
//     marginBottom: spacing.xl,
//   },
//   featuresTitle: {
//     fontSize: fontSize.xl,
//     fontWeight: '700',
//     color: colors.success,
//     marginBottom: spacing.md,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: spacing.sm,
//   },
//   featureBullet: {
//     fontSize: fontSize.lg,
//     color: colors.success,
//     fontWeight: 'bold',
//     marginRight: spacing.sm,
//     width: 24,
//   },
//   featureText: {
//     fontSize: fontSize.md,
//     color: colors.text,
//     flex: 1,
//   },
//   footer: {
//     alignItems: 'center',
//     paddingVertical: spacing.lg,
//   },
//   footerText: {
//     fontSize: fontSize.sm,
//     color: colors.textLight,
//     textAlign: 'center',
//   },
// });


import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../utils';

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerEmoji: {
    fontSize: 72,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  // Payment Card Styles
  paymentCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  paymentCardTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  paymentValue: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  paymentActions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  paymentActionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  paymentActionText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '600',
  },

  // Payment Form Styles
  paymentFormCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  paymentFormTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  paymentFormSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  inputIcon: {
    fontSize: fontSize.xl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  saveButton: {
    marginTop: spacing.md,
  },
  cancelButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.success + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.success,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 20,
  },

  logoutButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    width: '60%',
    alignSelf: 'center',
  },

  // ... rest of existing styles ...
  welcomeCard: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: spacing.xl,
  },
  welcomeTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  welcomeText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  actionCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.xl,
  },
  actionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  biometricButton: {
    marginTop: spacing.md,
  },
  demosContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  arrow: {
    fontSize: fontSize.xxxl,
    color: colors.textLight,
    fontWeight: '300',
  },
  featuresCard: {
    backgroundColor: colors.success + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    marginBottom: spacing.xl,
  },
  featuresTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.success,
    marginBottom: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureBullet: {
    fontSize: fontSize.lg,
    color: colors.success,
    fontWeight: 'bold',
    marginRight: spacing.sm,
    width: 24,
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    textAlign: 'center',
  },
});
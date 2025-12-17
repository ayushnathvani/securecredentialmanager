import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Button, TextInput } from '../../components';
import { styles } from './styles';
import { keychainService } from '../../utils/keychainService';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';

type RootStackParamList = {
  Home: undefined;
  SecureLogin: undefined;
  BiometricAuth: undefined;
  UserInfoDetails: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

  // Payment form states
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  // Saved payment details display
  const [savedPaymentDetails, setSavedPaymentDetails] =
    useState<PaymentDetails | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const { biometricSupport, getBiometricTypeName } = useBiometricAuth();

  // Load user info when screen loads
  useFocusEffect(
    React.useCallback(() => {
      loadUserInfo();
      loadSavedPaymentDetails();
    }, []),
  );

  const loadUserInfo = async () => {
    try {
      const credentials = await keychainService.getCredentials();
      if (credentials) {
        setUsername(credentials.username);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const loadSavedPaymentDetails = async () => {
    try {
      const paymentData = await keychainService.getSensitiveData(
        'payment_details',
        true, // Use biometric authentication
        'Authenticate to view payment details',
      );

      if (paymentData) {
        const parsed: PaymentDetails = JSON.parse(paymentData);
        setSavedPaymentDetails(parsed);
        setShowPaymentForm(false);
      } else {
        setSavedPaymentDetails(null);
        setShowPaymentForm(true);
      }
    } catch (error) {
      console.error('Error loading payment details:', error);
      setSavedPaymentDetails(null);
    }
  };

  const handleSavePaymentDetails = async () => {
    // Validation
    if (!cardholderName.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return;
    }

    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 13) {
      Alert.alert('Error', 'Please enter a valid card number');
      return;
    }

    if (!expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      Alert.alert('Error', 'Please enter expiry date in MM/YY format');
      return;
    }

    if (!cvv.trim() || cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return;
    }

    if (!billingAddress.trim()) {
      Alert.alert('Error', 'Please enter billing address');
      return;
    }

    // Check biometric availability
    if (!biometricSupport.available) {
      Alert.alert(
        'Biometric Not Available',
        'Biometric authentication is required to save payment details securely.',
      );
      return;
    }

    setSavingPayment(true);
    try {
      const paymentDetails: PaymentDetails = {
        cardholderName,
        cardNumber: maskCardNumber(cardNumber), // Store masked version
        expiryDate,
        cvv: '***', // Never store full CVV
        billingAddress,
      };

      // Save with biometric protection
      const success = await keychainService.saveSensitiveData(
        'payment_details',
        JSON.stringify(paymentDetails),
        true, // Require biometric authentication
      );

      if (success) {
        Alert.alert(
          'Success',
          `Payment details saved securely with ${getBiometricTypeName()} protection!`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form
                setCardholderName('');
                setCardNumber('');
                setExpiryDate('');
                setCvv('');
                setBillingAddress('');
                // Reload saved details
                loadSavedPaymentDetails();
              },
            },
          ],
        );
      } else {
        Alert.alert('Error', 'Failed to save payment details');
      }
    } catch (error) {
      console.error('Error saving payment details:', error);
      Alert.alert('Error', 'Failed to save payment details');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleEditPaymentDetails = () => {
    if (savedPaymentDetails) {
      setCardholderName(savedPaymentDetails.cardholderName);
      setCardNumber('');
      setExpiryDate(savedPaymentDetails.expiryDate);
      setCvv('');
      setBillingAddress(savedPaymentDetails.billingAddress);
    }
    setShowPaymentForm(true);
  };

  const handleDeletePaymentDetails = async () => {
    Alert.alert(
      'Delete Payment Details',
      'Are you sure you want to delete your saved payment details?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await keychainService.deleteSensitiveData(
                'payment_details',
                true, // Delete biometric-protected data
              );
              if (success) {
                setSavedPaymentDetails(null);
                setShowPaymentForm(true);
                Alert.alert('Success', 'Payment details deleted');
              } else {
                Alert.alert('Error', 'Failed to delete payment details');
              }
            } catch (error) {
              console.error('Error deleting payment details:', error);
              Alert.alert('Error', 'Failed to delete payment details');
            }
          },
        },
      ],
    );
  };

  const maskCardNumber = (cardNum: string): string => {
    const cleaned = cardNum.replace(/\s/g, '');
    const last4 = cleaned.slice(-4);
    return `**** **** **** ${last4}`;
  };

  const formatCardNumber = (text: string): string => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substr(0, 2)}/${cleaned.substr(2, 2)}`;
    }
    return cleaned;
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await keychainService.clearAuthState();
            await keychainService.deleteToken();
            navigation.replace('SecureLogin');
          } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
        {username ? <Text style={styles.subtitle}>@{username}</Text> : null}
      </View>

      {/* Saved Payment Details Display */}
      {!showPaymentForm && savedPaymentDetails && (
        <Card style={styles.paymentCard}>
          <Text style={styles.paymentCardTitle}>💳 Saved Payment Details</Text>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Cardholder:</Text>
            <Text style={styles.paymentValue}>
              {savedPaymentDetails.cardholderName}
            </Text>
          </View>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Card Number:</Text>
            <Text style={styles.paymentValue}>
              {savedPaymentDetails.cardNumber}
            </Text>
          </View>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Expiry:</Text>
            <Text style={styles.paymentValue}>
              {savedPaymentDetails.expiryDate}
            </Text>
          </View>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>CVV:</Text>
            <Text style={styles.paymentValue}>{savedPaymentDetails.cvv}</Text>
          </View>

          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentLabel}>Billing Address:</Text>
            <Text style={styles.paymentValue}>
              {savedPaymentDetails.billingAddress}
            </Text>
          </View>

          <View style={styles.paymentActions}>
            <TouchableOpacity
              style={[styles.paymentActionButton, styles.editButton]}
              onPress={handleEditPaymentDetails}
            >
              <Text style={styles.paymentActionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentActionButton, styles.deleteButton]}
              onPress={handleDeletePaymentDetails}
            >
              <Text style={styles.paymentActionText}> Delete</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {showPaymentForm && (
        <Card style={styles.paymentFormCard}>
          <Text style={styles.paymentFormTitle}>Payment Details</Text>
          <Text style={styles.paymentFormSubtitle}>
            Secured with {getBiometricTypeName()} encryption
          </Text>

          <TextInput
            label="Cardholder Name"
            value={cardholderName}
            onChangeText={setCardholderName}
            placeholder="John Doe"
            leftIcon={<Text style={styles.inputIcon}></Text>}
          />

          <TextInput
            label="Card Number"
            value={cardNumber}
            onChangeText={text => setCardNumber(formatCardNumber(text))}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
            leftIcon={<Text style={styles.inputIcon}></Text>}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <TextInput
                label="Expiry Date"
                value={expiryDate}
                onChangeText={text => setExpiryDate(formatExpiryDate(text))}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
                leftIcon={<Text style={styles.inputIcon}></Text>}
              />
            </View>

            <View style={styles.halfWidth}>
              <TextInput
                label="CVV"
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                leftIcon={<Text style={styles.inputIcon}></Text>}
              />
            </View>
          </View>

          <TextInput
            label="Billing Address"
            value={billingAddress}
            onChangeText={setBillingAddress}
            placeholder="123 Main St, City, State, ZIP"
            multiline
            numberOfLines={3}
            leftIcon={<Text style={styles.inputIcon}></Text>}
          />

          <Button
            title={savingPayment ? 'Saving...' : 'Save Payment Details'}
            onPress={handleSavePaymentDetails}
            loading={savingPayment}
            style={styles.saveButton}
          />

          {savedPaymentDetails && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPaymentForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </Card>
      )}

      {/* Security Info */}
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}> Security Information</Text>
        <Text style={styles.infoText}>
          • Payment details are encrypted using AES-256 encryption{'\n'}• Data
          is stored in device keychain with biometric protection{'\n'}•{' '}
          {getBiometricTypeName()} authentication required to access{'\n'}• CVV
          is never stored - masked for security{'\n'}• Card number is masked
          (only last 4 digits shown)
        </Text>
      </Card>

      <Button
        title="Logout"
        onPress={handleLogout}
        loading={loading}
        fullWidth={false}
        style={styles.logoutButton}
      />

      {/* <Button
        title="Manage Credentials"
        onPress={() => navigation.navigate('UserInfoDetails')}
        fullWidth={false}
        style={styles.biometricButton}
      /> */}
    </ScrollView>
  );
};

export default HomeScreen;

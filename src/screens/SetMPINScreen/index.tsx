import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, Button, TextInput } from '../../components';
import { styles } from './styles';
import { keychainService } from '../../utils/keychainService';

type RootStackParamList = {
  Home: undefined;
  SecureLogin: undefined;
  SetMPIN: undefined;
  VerifyMPIN: undefined;
};

type SetMPINScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SetMPIN'
>;

interface Props {
  navigation: SetMPINScreenNavigationProp;
}

const SetMPINScreen: React.FC<Props> = ({ navigation }) => {
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetMPIN = async () => {
    setError('');

    // Validation
    if (!mpin || !confirmMpin) {
      setError('Please enter MPIN in both fields');
      return;
    }

    if (mpin.length < 4 || mpin.length > 6) {
      setError('MPIN must be 4-6 digits');
      return;
    }

    if (!/^\d+$/.test(mpin)) {
      setError('MPIN must contain only numbers');
      return;
    }

    if (mpin !== confirmMpin) {
      setError('MPINs do not match');
      return;
    }

    setLoading(true);

    try {
      // Save MPIN securely
      const success = await keychainService.saveMPIN(mpin);

      if (success) {
        // Mark user as logged in
        await keychainService.saveAuthState(true);

        Alert.alert(
          'Success',
          'MPIN set successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Home'),
            },
          ],
          { cancelable: false },
        );
      } else {
        setError('Failed to save MPIN. Please try again.');
      }
    } catch (err) {
      console.error('Error setting MPIN:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🔐</Text>
        <Text style={styles.title}>Set Your MPIN</Text>
        <Text style={styles.subtitle}>
          Create a secure 4-6 digit MPIN to protect your account
        </Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.label}>Enter MPIN</Text>
        <TextInput
          value={mpin}
          onChangeText={setMpin}
          placeholder="Enter 4-6 digit MPIN"
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          autoFocus
        />

        <Text style={styles.label}>Confirm MPIN</Text>
        <TextInput
          value={confirmMpin}
          onChangeText={setConfirmMpin}
          placeholder="Re-enter MPIN"
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Set MPIN"
          onPress={handleSetMPIN}
          loading={loading}
          fullWidth
          style={styles.button}
        />
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 MPIN Security Tips</Text>
        <Text style={styles.infoText}>
          • Use 4-6 digits{'\n'}• Don't use simple patterns (1234){'\n'}• Keep
          it memorable but secure{'\n'}• Stored securely in device keychain
        </Text>
      </Card>
    </ScrollView>
  );
};

export default SetMPINScreen;

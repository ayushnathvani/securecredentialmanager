import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
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

type VerifyMPINScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerifyMPIN'
>;

interface Props {
  navigation: VerifyMPINScreenNavigationProp;
}

const VerifyMPINScreen: React.FC<Props> = ({ navigation }) => {
  const [mpin, setMpin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleVerifyMPIN = async () => {
    setError('');

    if (!mpin) {
      setError('Please enter your MPIN');
      return;
    }

    if (mpin.length < 4 || mpin.length > 6) {
      setError('MPIN must be 4-6 digits');
      return;
    }

    setLoading(true);

    try {
      const isValid = await keychainService.verifyMPIN(mpin);

      if (isValid) {
        // MPIN verified successfully
        await keychainService.saveAuthState(true);
        navigation.replace('Home');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          Alert.alert(
            'Too Many Attempts',
            'You have entered the wrong MPIN 3 times. Please login again.',
            [
              {
                text: 'OK',
                onPress: async () => {
                  await keychainService.clearAuthState();
                  await keychainService.deleteToken();
                  navigation.replace('SecureLogin');
                },
              },
            ],
            { cancelable: false },
          );
        } else {
          setError(`Incorrect MPIN. ${3 - newAttempts} attempts remaining.`);
          setMpin('');
        }
      }
    } catch (err) {
      console.error('Error verifying MPIN:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotMPIN = () => {
    Alert.alert(
      'Forgot MPIN',
      'To reset your MPIN, you need to logout and login again.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await keychainService.clearAuthState();
            await keychainService.deleteToken();
            await keychainService.deleteMPIN();
            navigation.replace('SecureLogin');
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🔑</Text>
        <Text style={styles.title}>Enter Your MPIN</Text>
        <Text style={styles.subtitle}>
          Enter your MPIN to access your account
        </Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.label}>MPIN</Text>
        <TextInput
          value={mpin}
          onChangeText={setMpin}
          placeholder="Enter your MPIN"
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          autoFocus
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Verify MPIN"
          onPress={handleVerifyMPIN}
          loading={loading}
          fullWidth
          style={styles.button}
        />

        <TouchableOpacity
          onPress={handleForgotMPIN}
          style={styles.forgotButton}
        >
          <Text style={styles.forgotText}>Forgot MPIN?</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>🔒 Secure Access</Text>
        <Text style={styles.infoText}>
          Your MPIN is stored securely in the device keychain using
          hardware-level encryption. After 3 failed attempts, you'll need to
          login again for security.
        </Text>
      </Card>
    </ScrollView>
  );
};

export default VerifyMPINScreen;

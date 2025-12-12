// Example: Integrate Biometric Authentication into Login Flow

import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, TextInput } from '../components';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

export const BiometricLoginExample = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {
    biometricSupport,
    loading,
    getBiometricTypeName,
    getBiometricIcon,
    saveCredentialsWithBiometrics,
    getCredentialsWithBiometrics,
  } = useBiometricAuth();

  // Check for saved credentials on mount
  useEffect(() => {
    attemptBiometricLogin();
  }, []);

  const attemptBiometricLogin = async () => {
    if (!biometricSupport.available) return;

    try {
      const credentials = await getCredentialsWithBiometrics(
        `Sign in with ${getBiometricTypeName()}`,
      );

      if (credentials) {
        // Auto-login with retrieved credentials
        await handleLogin(credentials.username, credentials.password, false);
      }
    } catch (error) {
      // User cancelled or biometric auth failed - show login form
      console.log('Biometric login cancelled or failed');
    }
  };

  const handleLogin = async (
    user: string,
    pass: string,
    saveToBiometrics: boolean = false,
  ) => {
    // Your login logic here
    const loginSuccess = await performLogin(user, pass);

    if (loginSuccess && saveToBiometrics && biometricSupport.available) {
      // Save credentials with biometric protection
      await saveCredentialsWithBiometrics(user, pass);
    }

    return loginSuccess;
  };

  const performLogin = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // Your actual login API call
    // This is just a mock
    return true;
  };

  return (
    <View>
      <Text>Login</Text>

      {/* Show biometric option if available */}
      {biometricSupport.available && (
        <View style={{ marginBottom: 16 }}>
          <Button
            title={`${getBiometricIcon()} Sign in with ${getBiometricTypeName()}`}
            onPress={attemptBiometricLogin}
            loading={loading}
            variant="secondary"
          />
        </View>
      )}

      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
      />

      <Button
        title="Login"
        onPress={() => handleLogin(username, password, true)}
        loading={loading}
      />
    </View>
  );
};

// ============================================
// Example: Protect Sensitive Settings
// ============================================

export const SecureSettingsExample = () => {
  const {
    biometricSupport,
    getSensitiveDataWithBiometrics,
    saveSensitiveDataWithBiometrics,
  } = useBiometricAuth();

  const loadApiKey = async () => {
    if (!biometricSupport.available) {
      Alert.alert('Error', 'Biometric authentication not available');
      return;
    }

    const apiKey = await getSensitiveDataWithBiometrics(
      'api_key',
      'Authenticate to view API Key',
    );

    if (apiKey) {
      Alert.alert('API Key', apiKey);
    }
  };

  const saveApiKey = async (key: string) => {
    if (!biometricSupport.available) {
      Alert.alert('Error', 'Biometric authentication not available');
      return;
    }

    const success = await saveSensitiveDataWithBiometrics('api_key', key);

    if (success) {
      Alert.alert('Success', 'API Key saved securely');
    }
  };

  return (
    <View>
      <Text>Secure Settings</Text>
      <Button title="View API Key" onPress={loadApiKey} />
      <Button
        title="Save New API Key"
        onPress={() => saveApiKey('sk-1234567890abcdef')}
      />
    </View>
  );
};

// ============================================
// Example: Session Token Protection
// ============================================

import { keychainService } from '../utils';

export const SecureSessionExample = {
  // Save session token with biometric protection
  saveSession: async (accessToken: string, refreshToken: string) => {
    await keychainService.saveTokenWithBiometrics(
      accessToken,
      new Date(Date.now() + 3600000).toISOString(), // 1 hour
    );

    await keychainService.saveSensitiveData(
      'refresh_token',
      refreshToken,
      true,
    );
  },

  // Restore session with biometric authentication
  restoreSession: async () => {
    try {
      const tokenData = await keychainService.getTokenWithBiometrics(
        'Authenticate to restore your session',
      );

      if (tokenData && tokenData.token) {
        const refreshToken = await keychainService.getSensitiveData(
          'refresh_token',
          'Authenticate to access refresh token',
        );

        return {
          accessToken: tokenData.token,
          refreshToken: refreshToken,
          expiresAt: tokenData.expiresAt,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to restore session:', error);
      return null;
    }
  },

  // Clear session
  clearSession: async () => {
    await keychainService.deleteToken();
    await keychainService.deleteSensitiveData('refresh_token');
  },
};

// ============================================
// Example: Payment Info Protection
// ============================================

export const SecurePaymentExample = () => {
  const { saveSensitiveDataWithBiometrics, getSensitiveDataWithBiometrics } =
    useBiometricAuth();

  const saveCardInfo = async (cardNumber: string, cvv: string) => {
    // Never store full card numbers in production!
    // This is just an example - use tokenization services
    const last4 = cardNumber.slice(-4);

    await saveSensitiveDataWithBiometrics('card_last4', last4);
    // Store encrypted payment token instead
    await saveSensitiveDataWithBiometrics(
      'payment_token',
      'encrypted_token_from_provider',
    );
  };

  const processPayment = async () => {
    const paymentToken = await getSensitiveDataWithBiometrics(
      'payment_token',
      'Authenticate to process payment',
    );

    if (paymentToken) {
      // Process payment with token
      console.log('Processing payment with token:', paymentToken);
    }
  };

  return (
    <View>
      <Button
        title="Save Card"
        onPress={() => saveCardInfo('4111111111111111', '123')}
      />
      <Button title="Pay Now" onPress={processPayment} />
    </View>
  );
};

// ============================================
// Example: Conditional Biometric Protection
// ============================================

export const ConditionalBiometricExample = () => {
  const [useBiometric, setUseBiometric] = useState(true);
  const { biometricSupport } = useBiometricAuth();

  const saveData = async (key: string, value: string) => {
    // Save with or without biometric protection based on user preference
    await keychainService.saveSensitiveData(
      key,
      value,
      useBiometric && biometricSupport.available,
    );
  };

  return (
    <View>
      {biometricSupport.available && (
        <View>
          <Text>Enable Biometric Protection</Text>
          <Button
            title={useBiometric ? 'Enabled' : 'Disabled'}
            onPress={() => setUseBiometric(!useBiometric)}
          />
        </View>
      )}
    </View>
  );
};

// ============================================
// Best Practices Summary
// ============================================

/*
1. Always check biometricSupport.available before using biometric features
2. Provide fallback UI for devices without biometric support
3. Use clear, specific prompts explaining why authentication is needed
4. Handle authentication cancellation gracefully (don't show errors)
5. Store only truly sensitive data with biometric protection
6. Test on real devices with actual biometric hardware
7. Consider user preferences - let them disable biometric auth
8. Use appropriate access control levels for your security needs
9. Clear biometric data on logout if needed
10. Follow platform guidelines for biometric UX

Access Control Options:
- BIOMETRY_ANY: Any enrolled biometric (most flexible)
- BIOMETRY_CURRENT_SET: Invalidates if biometrics change (most secure)
- DEVICE_PASSCODE: Falls back to device passcode
- BIOMETRY_ANY_OR_DEVICE_PASSCODE: Biometric or passcode

Choose based on your security requirements!
*/

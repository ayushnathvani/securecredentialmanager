import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, TextInput, Card } from '../../components';
import { useSecureLogin, useBiometricAuth } from '../../hooks';
import { styles } from './styles';
import type { RootStackParamList } from '../../navigation';
import { keychainService } from '../../utils/keychainService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SecureLoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    success,
    handleLogin,
    clearToken,
    savedCredentials,
    showSuggestion,
    useSavedCredentials,
    clearSavedCredentials,
    reloadCredentials,
  } = useSecureLogin();

  const {
    biometricSupport,
    loading: biometricLoading,
    getBiometricTypeName,
    getBiometricIcon,
    saveCredentialsWithBiometrics,
    getCredentialsWithBiometrics,
  } = useBiometricAuth();

  const [hasBiometricCredentials, setHasBiometricCredentials] = useState(false);

  const checkBiometricCredentials = async () => {
    try {
      const biometricEnabled = await keychainService.isBiometricEnabled();
      console.log('Biometric enabled check:', biometricEnabled);
      setHasBiometricCredentials(
        biometricEnabled && biometricSupport.available,
      );
    } catch (err) {
      console.error('Error checking biometric credentials:', err);
      setHasBiometricCredentials(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      reloadCredentials();
      checkBiometricCredentials();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadCredentials]),
  );

  const handleBiometricLogin = async () => {
    try {
      console.log('Starting biometric login...');

      // Try to get credentials with biometric authentication
      const credentials = await getCredentialsWithBiometrics(
        `Authenticate to login with ${getBiometricTypeName()}`,
      );

      console.log(
        'Biometric auth completed, credentials:',
        credentials ? 'Found' : 'Not found',
      );

    
      if (credentials) {
        // Credentials found - set auth state and go to Home
        console.log('Credentials found, navigating to Home...');
        await keychainService.setAuthState(true);
        navigation.replace('Home');
      } else {
        // Biometric was cancelled or failed
        Alert.alert(
          'Authentication Failed',
          'Please try again or use your credentials to login.',
        );
      }
    } catch (err) {
      console.error('Biometric login failed:', err);
      Alert.alert(
        'Authentication Failed',
        'Please try again or use your credentials to login.',
      );
    }
  };

  const proceedAfterLogin = async () => {
    try {
      // MPIN flow temporarily disabled - go straight to Home after login
      navigation.replace('Home');
    } catch (err) {
      console.error('Error checking MPIN:', err);
      navigation.replace('Home');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.emoji}></Text>
        <Text style={styles.title}>Secure Login</Text>
        <Text style={styles.subtitle}>Token Storage Demo</Text>
      </View>

      {/* Biometric Quick Login */}
      {hasBiometricCredentials && biometricSupport.available && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Quick Login</Text>
          <Text style={styles.description}>
            Use {getBiometricTypeName()} to login instantly with your saved
            credentials.
          </Text>
          <TouchableOpacity
            style={styles.biometricLoginButton}
            onPress={handleBiometricLogin}
            disabled={biometricLoading}
          >
            <Text style={styles.biometricIcon}>{getBiometricIcon()}</Text>
            <View style={styles.biometricTextContainer}>
              <Text style={styles.biometricTitle}>
                {biometricLoading
                  ? 'Authenticating...'
                  : `Login with ${getBiometricTypeName()}`}
              </Text>
              <Text style={styles.biometricSubtitle}>
                Tap to authenticate and login
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or login with credentials</Text>
            <View style={styles.divider} />
          </View>
        </Card>
      )}

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Login with Token Storage</Text>
        <Text style={styles.description}>
          Enter any username and password. Your credentials will be securely
          stored in the device keychain and auto-filled on your next visit.
        </Text>

        {showSuggestion && savedCredentials && (
          <TouchableOpacity
            style={styles.suggestionContainer}
            onPress={useSavedCredentials}
          >
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionIcon}></Text>
              <View style={styles.suggestionTextContainer}>
                <Text style={styles.suggestionTitle}>
                  Use saved credentials
                </Text>
                <Text style={styles.suggestionUsername}>
                  {savedCredentials.username}
                </Text>
              </View>
            </View>
            <Text style={styles.suggestionArrow}>→</Text>
          </TouchableOpacity>
        )}

        <TextInput
          label="Username or Email"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter any username"
          keyboardType="email-address"
          leftIcon={<Text style={styles.icon}></Text>}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter any password"
          secureTextEntry
          leftIcon={<Text style={styles.icon}></Text>}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>
              Login Successful! Token securely stored in keychain
            </Text>
          </View>
        )}

        <Button
          title={loading ? 'Logging in...' : 'Login Securely'}
          onPress={async () => {
            const loginSuccess = await handleLogin();
            if (loginSuccess) {
              const isNewUser = !savedCredentials;

              if (isNewUser && biometricSupport.available) {
                Alert.alert(
                  'Enable Biometric Login?',
                  `Would you like to enable ${getBiometricTypeName()} login for faster access next time? Your credentials will be encrypted and protected with ${getBiometricTypeName()}.`,
                  [
                    {
                      text: 'Not Now',
                      style: 'cancel',
                      onPress: async () => {
                        await proceedAfterLogin();
                      },
                    },
                    {
                      text: 'Enable',
                      onPress: async () => {
                        try {
                          const saved = await saveCredentialsWithBiometrics(
                            username,
                            password,
                          );
                          if (saved) {
                            await keychainService.setBiometricEnabled();
                            setHasBiometricCredentials(true);
                          }
                          await proceedAfterLogin();
                        } catch (err) {
                          console.error(
                            'Failed to save biometric credentials:',
                            err,
                          );
                          await proceedAfterLogin();
                        }
                      },
                    },
                  ],
                );
              } else if (isNewUser) {
                Alert.alert(
                  'Save Login Credentials?',
                  "Would you like to securely save your login credentials for faster access next time? Your credentials will be encrypted and stored in your device's secure keychain.",
                  [
                    {
                      text: 'Not Now',
                      style: 'cancel',
                      onPress: async () => {
                        await proceedAfterLogin();
                      },
                    },
                    {
                      text: 'Save',
                      onPress: async () => {
                        try {
                          Alert.alert(
                            'Success',
                            'Your credentials have been saved securely!',
                          );
                          await proceedAfterLogin();
                        } catch (err) {
                          console.error('Failed to save credentials:', err);
                          await proceedAfterLogin();
                        }
                      },
                    },
                  ],
                );
              } else {
                await proceedAfterLogin();
              }
            }
          }}
          loading={loading}
          fullWidth
          style={styles.button}
        />

        {error && (
          <Button
            title="Clear Token"
            onPress={() => {
              clearToken();
              Alert.alert('Success', 'Token cleared from keychain');
            }}
            variant="outline"
            fullWidth
            style={styles.button}
          />
        )}

        {savedCredentials && (
          <Button
            title="Clear Saved Credentials"
            onPress={() => {
              clearSavedCredentials();
              Alert.alert('Success', 'Saved credentials cleared');
            }}
            variant="outline"
            fullWidth
            style={styles.button}
          />
        )}
      </Card>
    </ScrollView>
  );
};

export default SecureLoginScreen;

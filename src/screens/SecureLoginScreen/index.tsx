import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, TextInput, Card, Checkbox } from '../../components';
import { useSecureLogin } from '../../hooks';
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

  useFocusEffect(
    React.useCallback(() => {
      reloadCredentials();
    }, [reloadCredentials]),
  );

  const proceedAfterLogin = async () => {
    try {
      // Check if MPIN exists
      const hasMPIN = await keychainService.getMPIN();

      if (hasMPIN) {
        navigation.replace('VerifyMPIN');
      } else {
        navigation.replace('SetMPIN');
      }
    } catch (err) {
      console.error('Error checking MPIN:', err);
      navigation.replace('SetMPIN');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🔐</Text>
        <Text style={styles.title}>Secure Login</Text>
        <Text style={styles.subtitle}>Token Storage Demo</Text>
      </View>

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
              <Text style={styles.suggestionIcon}>💾</Text>
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
          leftIcon={<Text style={styles.icon}>👤</Text>}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter any password"
          secureTextEntry
          leftIcon={<Text style={styles.icon}>🔑</Text>}
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
            // Navigate to MPIN setup or verify after successful login
            if (loginSuccess) {
              // Check if this is a new user (no saved credentials before)
              const isNewUser = !savedCredentials;

              if (isNewUser) {
                // Prompt user to save credentials for new users
                Alert.alert(
                  'Save Login Credentials?',
                  "Would you like to securely save your login credentials for faster access next time? Your credentials will be encrypted and stored in your device's secure keychain.",
                  [
                    {
                      text: 'Not Now',
                      style: 'cancel',
                      onPress: async () => {
                        // Continue without saving
                        await proceedAfterLogin();
                      },
                    },
                    {
                      text: 'Save',
                      onPress: async () => {
                        try {
                          // Credentials already saved by handleLogin
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
                // Returning user with saved credentials
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

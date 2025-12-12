import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { keychainService, BiometricType } from '../utils';

export const useBiometricAuth = () => {
  const [biometricSupport, setBiometricSupport] = useState<BiometricType>({
    available: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const support = await keychainService.getSupportedBiometryType();
    setBiometricSupport(support);
  };

  const getBiometricTypeName = (): string => {
    if (!biometricSupport.biometryType) {
      return 'Biometrics';
    }

    switch (biometricSupport.biometryType) {
      case 'FaceID':
        return 'Face ID';
      case 'TouchID':
        return 'Touch ID';
      case 'Fingerprint':
        return 'Fingerprint';
      case 'Face':
        return 'Face Recognition';
      case 'Iris':
        return 'Iris Recognition';
      default:
        return 'Biometrics';
    }
  };

  const getBiometricIcon = (): string => {
    if (!biometricSupport.biometryType) {
      return '🔐';
    }

    switch (biometricSupport.biometryType) {
      case 'FaceID':
      case 'Face':
        return '😊';
      case 'TouchID':
      case 'Fingerprint':
        return '👆';
      case 'Iris':
        return '👁️';
      default:
        return '🔐';
    }
  };

  const authenticateWithBiometrics = async (
    promptMessage?: string,
  ): Promise<boolean> => {
    if (!biometricSupport.available) {
      setError('Biometric authentication is not available on this device');
      Alert.alert(
        'Not Available',
        'Biometric authentication is not available on this device',
      );
      return false;
    }

    setLoading(true);
    setError('');

    try {
      // Try to retrieve a test credential to trigger biometric prompt
      const credentials = await keychainService.getCredentialsWithBiometrics(
        undefined,
        promptMessage,
      );

      setLoading(false);
      return credentials !== null;
    } catch (err) {
      setLoading(false);
      setError('Authentication failed');
      return false;
    }
  };

  const saveCredentialsWithBiometrics = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    if (!biometricSupport.available) {
      Alert.alert(
        'Not Available',
        'Biometric authentication is not available. Saving without biometric protection.',
      );
      return await keychainService.saveCredentials(username, password);
    }

    setLoading(true);
    setError('');

    try {
      const success = await keychainService.saveCredentialsWithBiometrics(
        username,
        password,
      );

      if (success) {
        Alert.alert(
          'Success',
          `Your credentials have been securely saved with ${getBiometricTypeName()} or device passcode protection.`,
        );
      } else {
        setError('Failed to save credentials');
        Alert.alert(
          'Error',
          'Failed to save credentials. Please ensure your device has a secure lock screen set up (PIN, pattern, password, or biometric).',
        );
      }

      setLoading(false);
      return success;
    } catch (err) {
      setLoading(false);
      setError('Failed to save credentials');
      Alert.alert('Error', 'An error occurred while saving credentials');
      return false;
    }
  };

  const getCredentialsWithBiometrics = async (
    promptMessage?: string,
  ): Promise<{ username: string; password: string } | null> => {
    if (!biometricSupport.available) {
      setError('Biometric authentication is not available');
      console.log('Biometric not available');
      return null;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Calling keychainService.getCredentialsWithBiometrics...');
      const credentials = await keychainService.getCredentialsWithBiometrics(
        undefined,
        promptMessage || `Authenticate with ${getBiometricTypeName()}`,
      );

      console.log('Credentials retrieved:', credentials ? 'Success' : 'Null');
      setLoading(false);
      return credentials;
    } catch (err) {
      console.error('getCredentialsWithBiometrics error:', err);
      setLoading(false);
      setError('Failed to retrieve credentials');
      return null;
    }
  };

  const saveSensitiveDataWithBiometrics = async (
    key: string,
    value: string,
  ): Promise<boolean> => {
    if (!biometricSupport.available) {
      Alert.alert(
        'Not Available',
        'Biometric authentication is not available. Saving without biometric protection.',
      );
      return await keychainService.saveSensitiveData(key, value, false);
    }

    setLoading(true);
    setError('');

    try {
      const success = await keychainService.saveSensitiveData(key, value, true);

      if (success) {
        Alert.alert(
          'Success',
          `Your data has been securely saved with ${getBiometricTypeName()} or device passcode protection.`,
        );
      } else {
        setError('Failed to save data');
        Alert.alert(
          'Error',
          'Failed to save data. Please ensure your device has a secure lock screen set up.',
        );
      }

      setLoading(false);
      return success;
    } catch (err) {
      setLoading(false);
      setError('Failed to save data');
      return false;
    }
  };

  const getSensitiveDataWithBiometrics = async (
    key: string,
    promptMessage?: string,
  ): Promise<string | null> => {
    if (!biometricSupport.available) {
      setError('Biometric authentication is not available');
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const data = await keychainService.getSensitiveData(
        key,
        promptMessage || `Authenticate with ${getBiometricTypeName()}`,
      );

      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError('Failed to retrieve data');
      return null;
    }
  };

  return {
    biometricSupport,
    loading,
    error,
    getBiometricTypeName,
    getBiometricIcon,
    authenticateWithBiometrics,
    saveCredentialsWithBiometrics,
    getCredentialsWithBiometrics,
    saveSensitiveDataWithBiometrics,
    getSensitiveDataWithBiometrics,
    checkBiometricSupport,
  };
};

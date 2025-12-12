import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button, TextInput, Card } from '../../components';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';
import { styles } from './styles';

const BiometricAuthScreen = () => {
  const {
    biometricSupport,
    loading,
    getBiometricTypeName,
    getBiometricIcon,
    saveCredentialsWithBiometrics,
    getCredentialsWithBiometrics,
    saveSensitiveDataWithBiometrics,
    getSensitiveDataWithBiometrics,
  } = useBiometricAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sensitiveKey, setSensitiveKey] = useState('');
  const [sensitiveValue, setSensitiveValue] = useState('');
  const [retrievedData, setRetrievedData] = useState<string>('');

  const handleSaveCredentials = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    const success = await saveCredentialsWithBiometrics(username, password);
    if (success) {
      setUsername('');
      setPassword('');
    }
  };

  const handleGetCredentials = async () => {
    const credentials = await getCredentialsWithBiometrics(
      `Authenticate to retrieve your credentials`,
    );

    if (credentials) {
      Alert.alert(
        'Credentials Retrieved',
        `Username: ${credentials.username}\nPassword: ${credentials.password}`,
        [{ text: 'OK' }],
      );
      setRetrievedData(
        `Username: ${credentials.username}\nPassword: ${credentials.password}`,
      );
    } else {
      Alert.alert('Error', 'Failed to retrieve credentials');
    }
  };

  const handleSaveSensitiveData = async () => {
    if (!sensitiveKey || !sensitiveValue) {
      Alert.alert('Error', 'Please enter both key and value');
      return;
    }

    const success = await saveSensitiveDataWithBiometrics(
      sensitiveKey,
      sensitiveValue,
    );
    if (success) {
      setSensitiveKey('');
      setSensitiveValue('');
    }
  };

  const handleGetSensitiveData = async () => {
    if (!sensitiveKey) {
      Alert.alert('Error', 'Please enter a key to retrieve');
      return;
    }

    const data = await getSensitiveDataWithBiometrics(
      sensitiveKey,
      `Authenticate to retrieve your data`,
    );

    if (data) {
      Alert.alert('Data Retrieved', `Value: ${data}`, [{ text: 'OK' }]);
      setRetrievedData(`Key: ${sensitiveKey}\nValue: ${data}`);
    } else {
      Alert.alert('Error', 'Failed to retrieve data or data not found');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{getBiometricIcon()}</Text>
        <Text style={styles.title}>Biometric Authentication</Text>
        <Text style={styles.subtitle}>
          Secure Data with {getBiometricTypeName()}
        </Text>
      </View>

      {/* Biometric Support Status */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Biometric Status</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text
            style={[
              styles.statusValue,
              biometricSupport.available
                ? styles.statusAvailable
                : styles.statusUnavailable,
            ]}
          >
            {biometricSupport.available ? '✓ Available' : '✗ Not Available'}
          </Text>
        </View>
        {biometricSupport.available && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Type:</Text>
            <Text style={styles.statusValue}>{getBiometricTypeName()}</Text>
          </View>
        )}
        {biometricSupport.error && (
          <Text style={styles.errorText}>{biometricSupport.error}</Text>
        )}
      </Card>

      {/* Save Credentials with Biometrics */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Save Credentials</Text>
        <Text style={styles.description}>
          Store your credentials securely with {getBiometricTypeName()}{' '}
          protection
        </Text>

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          leftIcon={<Text style={styles.icon}>👤</Text>}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          leftIcon={<Text style={styles.icon}>🔒</Text>}
        />

        <Button
          title={loading ? 'Saving...' : 'Save with Biometrics'}
          onPress={handleSaveCredentials}
          disabled={loading || !biometricSupport.available}
          style={styles.button}
        />
      </Card>

      {/* Retrieve Credentials */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Retrieve Credentials</Text>
        <Text style={styles.description}>
          Use {getBiometricTypeName()} to unlock your saved credentials
        </Text>

        <Button
          title={loading ? 'Retrieving...' : 'Get Credentials'}
          onPress={handleGetCredentials}
          disabled={loading || !biometricSupport.available}
          variant="secondary"
          style={styles.button}
        />
      </Card>

      {/* Save Generic Sensitive Data */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Save Sensitive Data</Text>
        <Text style={styles.description}>
          Store any sensitive information with {getBiometricTypeName()}{' '}
          protection
        </Text>

        <TextInput
          label="Key"
          value={sensitiveKey}
          onChangeText={setSensitiveKey}
          placeholder="e.g., api_key, secret_token"
          leftIcon={<Text style={styles.icon}>🔑</Text>}
        />

        <TextInput
          label="Value"
          value={sensitiveValue}
          onChangeText={setSensitiveValue}
          placeholder="Enter sensitive value"
          secureTextEntry
          leftIcon={<Text style={styles.icon}>💎</Text>}
        />

        <Button
          title={loading ? 'Saving...' : 'Save Data'}
          onPress={handleSaveSensitiveData}
          disabled={loading || !biometricSupport.available}
          style={styles.button}
        />
      </Card>

      {/* Retrieve Sensitive Data */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Retrieve Sensitive Data</Text>
        <Text style={styles.description}>
          Use the key to retrieve your stored data
        </Text>

        <TextInput
          label="Key"
          value={sensitiveKey}
          onChangeText={setSensitiveKey}
          placeholder="Enter key to retrieve"
          leftIcon={<Text style={styles.icon}>🔑</Text>}
        />

        <Button
          title={loading ? 'Retrieving...' : 'Get Data'}
          onPress={handleGetSensitiveData}
          disabled={loading || !biometricSupport.available}
          variant="secondary"
          style={styles.button}
        />
      </Card>

      {/* Retrieved Data Display */}
      {retrievedData ? (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Retrieved Data</Text>
          <View style={styles.retrievedDataContainer}>
            <Text style={styles.retrievedDataText}>{retrievedData}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setRetrievedData('')}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </Card>
      ) : null}

      {/* Info Card */}
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ How It Works</Text>
        <Text style={styles.infoText}>
          • All data is stored in the device's secure Keychain/Keystore
        </Text>
        <Text style={styles.infoText}>
          • {getBiometricTypeName()} authentication is required to access
          protected data
        </Text>
        <Text style={styles.infoText}>
          • Data never leaves your device and is hardware-encrypted
        </Text>
        <Text style={styles.infoText}>
          • Use ACCESS_CONTROL.BIOMETRY_ANY for biometric protection
        </Text>
      </Card>
    </ScrollView>
  );
};

export default BiometricAuthScreen;

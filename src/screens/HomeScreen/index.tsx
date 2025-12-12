import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Button } from '../../components';
import { styles } from './styles';
import { keychainService } from '../../utils/keychainService';

type RootStackParamList = {
  Home: undefined;
  SecureLogin: undefined;
  BiometricAuth: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load user info when screen loads
  useFocusEffect(
    React.useCallback(() => {
      loadUserInfo();
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
            // Clear auth state so user needs to login again
            await keychainService.clearAuthState();

            // Clear the auth token
            await keychainService.deleteToken();

            // Navigate to login screen
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>👋</Text>
        <Text style={styles.title}>Welcome Back!</Text>
        {username ? <Text style={styles.subtitle}>@{username}</Text> : null}
      </View>

      <Card style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}> You're Logged In</Text>
        <Text style={styles.welcomeText}>
          Your credentials are securely stored in the device keychain using
          hardware-level encryption.
        </Text>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>🔐 Security Features</Text>
        <Text style={styles.infoText}>
          ✓ Encrypted credential storage{'\n'}✓ Auto-fill on next login{'\n'}✓
          Secure token management{'\n'}✓ Hardware-backed security{'\n'}✓
          Biometric authentication
        </Text>
      </Card>

      <Card style={styles.actionCard}>
        <Text style={styles.actionTitle}>Try Biometric Authentication</Text>
        <Text style={styles.infoText}>
          Experience secure data storage with Face ID, Touch ID, or Fingerprint
          protection
        </Text>
        <Button
          title="Open Biometric Demo"
          onPress={() => navigation.navigate('BiometricAuth')}
          variant="secondary"
          fullWidth
          style={styles.biometricButton}
        />
      </Card>

      <Card style={styles.actionCard}>
        <Text style={styles.actionTitle}>Account Actions</Text>
        <Button
          title="Logout"
          onPress={handleLogout}
          loading={loading}
          fullWidth
          style={styles.logoutButton}
        />
      </Card>
    </ScrollView>
  );
};

export default HomeScreen;

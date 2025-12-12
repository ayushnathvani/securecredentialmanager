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

  // --- Simplified UI: centered title, username, logout button ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      {username ? <Text style={styles.subtitle}>@{username}</Text> : null}
      <Button
        title="Logout"
        onPress={handleLogout}
        loading={loading}
        fullWidth={false}
        style={styles.logoutButton}
      />
    </View>
  );
};

export default HomeScreen;

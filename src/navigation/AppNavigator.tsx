import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  SecureLoginScreen,
  SetMPINScreen,
  VerifyMPINScreen,
  BiometricAuthScreen,
  UserInfoDetails,
} from '../screens';
import { colors } from '../utils';
import { keychainService } from '../utils/keychainService';

export type RootStackParamList = {
  Home: undefined;
  SecureLogin: undefined;
  SetMPIN: undefined;
  VerifyMPIN: undefined;
  BiometricAuth: undefined;
  UserInfoDetails: undefined;
  ImageLoader: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<
    'SecureLogin' | 'Home' | 'VerifyMPIN'
  >('SecureLogin');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Check if user is logged in (has valid auth state)
      const isLoggedIn = await keychainService.getAuthState();

      if (isLoggedIn) {
        // MPIN flow temporarily disabled - navigate directly to Home when logged in
        setInitialRoute('Home');
      } else {
        // Not logged in, show login screen
        setInitialRoute('SecureLogin');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setInitialRoute('SecureLogin');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or return a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: true,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Secure Credential Manager',
            headerStyle: {
              backgroundColor: colors.primary,
            },
          }}
        />
        <Stack.Screen
          name="SecureLogin"
          component={SecureLoginScreen}
          options={{
            title: 'Secure Login',
          }}
        />
        <Stack.Screen
          name="SetMPIN"
          component={SetMPINScreen}
          options={{
            title: 'Set MPIN',
            headerLeft: () => null, // Prevent back navigation
          }}
        />
        <Stack.Screen
          name="VerifyMPIN"
          component={VerifyMPINScreen}
          options={{
            title: 'Verify MPIN',
            headerLeft: () => null, // Prevent back navigation
          }}
        />
        <Stack.Screen
          name="BiometricAuth"
          component={BiometricAuthScreen}
          options={{
            title: 'Biometric Authentication',
          }}
        />
        <Stack.Screen
          name="UserInfoDetails"
          component={UserInfoDetails}
          options={{
            title: 'User Info / Credentials',
          }}
        />
        <Stack.Screen
          name="ImageLoader"
          // lazy-load component import to avoid import ordering issues
          component={require('../screens/ImageLoaderScreen').default}
          options={{
            title: 'Image Loader',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

import * as Keychain from 'react-native-keychain';

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthToken {
  token: string;
  expiresAt?: string;
}

export interface BiometricType {
  available: boolean;
  biometryType?: Keychain.BIOMETRY_TYPE;
  error?: string;
}

const KEYCHAIN_SERVICE = 'SecureCredentialManager';

export const keychainService = {
  saveCredentials: async (
    username: string,
    password: string,
    service?: string,
  ): Promise<boolean> => {
    try {
      await Keychain.setGenericPassword(username, password, {
        service: service || KEYCHAIN_SERVICE,
      });
      return true;
    } catch (error) {
      console.error('Error saving credentials:', error);
      return false;
    }
  },

  getCredentials: async (service?: string): Promise<Credentials | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: service || KEYCHAIN_SERVICE,
      });

      if (credentials) {
        return {
          username: credentials.username,
          password: credentials.password,
        };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  },

  deleteCredentials: async (service?: string): Promise<boolean> => {
    try {
      await Keychain.resetGenericPassword({
        service: service || KEYCHAIN_SERVICE,
      });
      return true;
    } catch (error) {
      console.error('Error deleting credentials:', error);
      return false;
    }
  },

  saveToken: async (token: string, expiresAt?: string): Promise<boolean> => {
    try {
      const tokenData = JSON.stringify({ token, expiresAt });
      await Keychain.setGenericPassword('auth_token', tokenData, {
        service: `${KEYCHAIN_SERVICE}_TOKEN`,
      });
      return true;
    } catch (error) {
      console.error('Error saving token:', error);
      return false;
    }
  },

  getToken: async (): Promise<AuthToken | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${KEYCHAIN_SERVICE}_TOKEN`,
      });

      if (credentials) {
        const tokenData = JSON.parse(credentials.password);
        return tokenData;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },

  deleteToken: async (): Promise<boolean> => {
    try {
      await Keychain.resetGenericPassword({
        service: `${KEYCHAIN_SERVICE}_TOKEN`,
      });
      return true;
    } catch (error) {
      console.error('Error deleting token:', error);
      return false;
    }
  },

  // MPIN Management
  saveMPIN: async (mpin: string): Promise<boolean> => {
    try {
      await Keychain.setGenericPassword('mpin', mpin, {
        service: `${KEYCHAIN_SERVICE}_MPIN`,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      return true;
    } catch (error) {
      console.error('Error saving MPIN:', error);
      return false;
    }
  },

  getMPIN: async (): Promise<string | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${KEYCHAIN_SERVICE}_MPIN`,
      });

      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving MPIN:', error);
      return null;
    }
  },

  verifyMPIN: async (inputMpin: string): Promise<boolean> => {
    try {
      const savedMpin = await keychainService.getMPIN();
      return savedMpin === inputMpin;
    } catch (error) {
      console.error('Error verifying MPIN:', error);
      return false;
    }
  },

  deleteMPIN: async (): Promise<boolean> => {
    try {
      await Keychain.resetGenericPassword({
        service: `${KEYCHAIN_SERVICE}_MPIN`,
      });
      return true;
    } catch (error) {
      console.error('Error deleting MPIN:', error);
      return false;
    }
  },

  // Auth State Management
  saveAuthState: async (isLoggedIn: boolean): Promise<boolean> => {
    try {
      await Keychain.setGenericPassword('auth_state', isLoggedIn.toString(), {
        service: `${KEYCHAIN_SERVICE}_AUTH_STATE`,
      });
      return true;
    } catch (error) {
      console.error('Error saving auth state:', error);
      return false;
    }
  },

  getAuthState: async (): Promise<boolean> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${KEYCHAIN_SERVICE}_AUTH_STATE`,
      });

      if (credentials) {
        return credentials.password === 'true';
      }
      return false;
    } catch (error) {
      console.error('Error retrieving auth state:', error);
      return false;
    }
  },

  clearAuthState: async (): Promise<boolean> => {
    try {
      await Keychain.resetGenericPassword({
        service: `${KEYCHAIN_SERVICE}_AUTH_STATE`,
      });
      return true;
    } catch (error) {
      console.error('Error clearing auth state:', error);
      return false;
    }
  },

  // Biometric Authentication Methods
  getSupportedBiometryType: async (): Promise<BiometricType> => {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      return {
        available: biometryType !== null,
        biometryType: biometryType || undefined,
      };
    } catch (error) {
      console.error('Error checking biometry support:', error);
      return {
        available: false,
        error: 'Failed to check biometric support',
      };
    }
  },

  // Check if biometric credentials exist (without triggering biometric prompt)
  hasBiometricCredentials: async (): Promise<boolean> => {
    try {
      // Try to get credentials - on Android with biometric protection,
      // this will return false if no credentials exist (won't trigger prompt)
      // We use a simple check without authenticationPrompt
      const credentials = await Keychain.getGenericPassword({
        service: `${KEYCHAIN_SERVICE}_BIOMETRIC`,
      });
      const result = credentials !== false && credentials !== null;
      console.log('hasBiometricCredentials result:', result);
      return result;
    } catch (error) {
      console.error('Error checking biometric credentials:', error);
      return false;
    }
  },

  // Set auth state (login status)
  setAuthState: async (isLoggedIn: boolean): Promise<boolean> => {
    try {
      await Keychain.setGenericPassword('auth_state', isLoggedIn.toString(), {
        service: `${KEYCHAIN_SERVICE}_AUTH_STATE`,
      });
      return true;
    } catch (error) {
      console.error('Error setting auth state:', error);
      return false;
    }
  },

  setBiometricEnabled: async (): Promise<boolean> => {
    try {
      await Keychain.setGenericPassword('biometric_enabled', 'true', {
        service: `${KEYCHAIN_SERVICE}_BIOMETRIC_FLAG`,
      });
      console.log('Biometric flag set');
      return true;
    } catch (error) {
      console.error('Error setting biometric flag:', error);
      return false;
    }
  },

  isBiometricEnabled: async (): Promise<boolean> => {
    try {
      const result = await Keychain.getGenericPassword({
        service: `${KEYCHAIN_SERVICE}_BIOMETRIC_FLAG`,
      });
      const isEnabled = result !== false && result !== null;
      console.log('isBiometricEnabled:', isEnabled);
      return isEnabled;
    } catch (error) {
      console.log('Biometric not enabled:', error);
      return false;
    }
  },

  saveCredentialsWithBiometrics: async (
    username: string,
    password: string,
    service?: string,
  ): Promise<boolean> => {
    try {
      await Keychain.setGenericPassword(username, password, {
        service: service || `${KEYCHAIN_SERVICE}_BIOMETRIC`,
        accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
        storage: Keychain.STORAGE_TYPE.RSA,
      });
      console.log('Credentials saved with biometric protection');
      return true;
    } catch (error: any) {
      console.warn(
        'RSA biometric save failed, trying fallback:',
        error.message,
      );
      // Fallback to AES storage
      // try {
      //   await Keychain.setGenericPassword(username, password, {
      //     service: service || `${KEYCHAIN_SERVICE}_BIOMETRIC`,
      //     accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      //     securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
      //     storage: Keychain.STORAGE_TYPE.AES,
      //   });
      //   console.log('Credentials saved with AES encryption (fallback)');
      //   return true;
      // } catch (fallbackError) {
      //   console.error('Error saving credentials:', fallbackError);
      //   return false;
      // }
    }
  },

  getCredentialsWithBiometrics: async (
    service?: string,
    promptMessage?: string,
  ): Promise<Credentials | null> => {
    try {
      console.log(
        'getCredentialsWithBiometrics called, service:',
        service || `${KEYCHAIN_SERVICE}_BIOMETRIC`,
      );
      const credentials = await Keychain.getGenericPassword({
        service: service || `${KEYCHAIN_SERVICE}_BIOMETRIC`,
        authenticationPrompt: {
          title: promptMessage || 'Authenticate to access your credentials',
          subtitle: 'Biometric authentication required',
          description: 'Use your fingerprint to unlock',
          cancel: 'Cancel',
        },
      });

      console.log(
        'Keychain response:',
        credentials ? 'Credentials found' : 'No credentials',
      );

      if (credentials && credentials.username && credentials.password) {
        console.log('Returning credentials for user:', credentials.username);
        return {
          username: credentials.username,
          password: credentials.password,
        };
      }
      console.log('No valid credentials found');
      return null;
    } catch (error) {
      console.error('Error retrieving credentials with biometrics:', error);
      return null;
    }
  },

  saveTokenWithBiometrics: async (
    token: string,
    expiresAt?: string,
  ): Promise<boolean> => {
    try {
      const tokenData = JSON.stringify({ token, expiresAt });
      await Keychain.setGenericPassword('auth_token', tokenData, {
        service: `${KEYCHAIN_SERVICE}_TOKEN`,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
        storage: Keychain.STORAGE_TYPE.AES,
      });
      return true;
    } catch (error) {
      console.error('Error saving token with biometrics:', error);
      return false;
    }
  },

  getTokenWithBiometrics: async (
    promptMessage?: string,
  ): Promise<AuthToken | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${KEYCHAIN_SERVICE}_TOKEN`,
        authenticationPrompt: {
          title: promptMessage || 'Authenticate to access your session',
          subtitle: 'Use biometrics to unlock',
          description: 'Place your finger on the sensor',
          cancel: 'Cancel',
        },
      });

      if (credentials) {
        const tokenData = JSON.parse(credentials.password);
        return tokenData;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving token with biometrics:', error);
      return null;
    }
  },

  saveMPINWithBiometrics: async (mpin: string): Promise<boolean> => {
    try {
      await Keychain.setGenericPassword('mpin', mpin, {
        service: `${KEYCHAIN_SERVICE}_MPIN`,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
        storage: Keychain.STORAGE_TYPE.AES,
      });
      return true;
    } catch (error) {
      console.error('Error saving MPIN with biometrics:', error);
      return false;
    }
  },

  getMPINWithBiometrics: async (
    promptMessage?: string,
  ): Promise<string | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${KEYCHAIN_SERVICE}_MPIN`,
        authenticationPrompt: {
          title: promptMessage || 'Authenticate to access your MPIN',
          subtitle: 'Use biometrics to unlock',
          description: 'Place your finger on the sensor',
          cancel: 'Cancel',
        },
      });

      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving MPIN with biometrics:', error);
      return null;
    }
  },

  verifyMPINWithBiometrics: async (
    inputMpin: string,
    promptMessage?: string,
  ): Promise<boolean> => {
    try {
      const savedMpin = await keychainService.getMPINWithBiometrics(
        promptMessage,
      );
      return savedMpin === inputMpin;
    } catch (error) {
      console.error('Error verifying MPIN with biometrics:', error);
      return false;
    }
  },

  // Generic method to save any sensitive data with biometric protection
  saveSensitiveData: async (
    key: string,
    value: string,
    useBiometrics: boolean = true,
  ): Promise<boolean> => {
    try {
      const serviceKey = `${KEYCHAIN_SERVICE}_${key.toUpperCase()}_BIO`;

      if (useBiometrics) {
        // Try RSA with biometric first
        try {
          await Keychain.setGenericPassword(key, value, {
            service: serviceKey,
            accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
            storage: Keychain.STORAGE_TYPE.RSA,
          });
          return true;
        } catch (rsaError: any) {
          console.warn(
            'RSA biometric failed, using AES fallback:',
            rsaError.message,
          );
          await Keychain.setGenericPassword(key, value, {
            service: serviceKey,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
            storage: Keychain.STORAGE_TYPE.AES,
          });
          return true;
        }
      } else {
        await Keychain.setGenericPassword(key, value, {
          service: `${KEYCHAIN_SERVICE}_${key.toUpperCase()}`,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
        return true;
      }
    } catch (error) {
      console.error('Error saving sensitive data:', error);
      return false;
    }
  },

  getSensitiveData: async (
    key: string,
    useBiometrics: boolean = false,
    promptMessage?: string,
  ): Promise<string | null> => {
    try {
      const serviceKey = useBiometrics
        ? `${KEYCHAIN_SERVICE}_${key.toUpperCase()}_BIO`
        : `${KEYCHAIN_SERVICE}_${key.toUpperCase()}`;

      const options: Keychain.Options = {
        service: serviceKey,
      };

      if (useBiometrics) {
        options.authenticationPrompt = {
          title: promptMessage || 'Authenticate to access secure data',
          subtitle: 'Use biometrics to unlock',
          description: 'Place your finger on the sensor',
          cancel: 'Cancel',
        };
      }

      const credentials = await Keychain.getGenericPassword(options);

      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving sensitive data:', error);
      return null;
    }
  },

  deleteSensitiveData: async (
    key: string,
    useBiometrics: boolean = false,
  ): Promise<boolean> => {
    try {
      const serviceKey = useBiometrics
        ? `${KEYCHAIN_SERVICE}_${key.toUpperCase()}_BIO`
        : `${KEYCHAIN_SERVICE}_${key.toUpperCase()}`;

      await Keychain.resetGenericPassword({
        service: serviceKey,
      });
      return true;
    } catch (error) {
      console.error('Error deleting sensitive data:', error);
      return false;
    }
  },

  // Internet credentials helpers (useful when a server/host is provided)
  saveInternetCredentials: async (
    server: string | undefined,
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const svc = server || `${KEYCHAIN_SERVICE}_INTERNET`;
      // react-native-keychain exposes setInternetCredentials
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await Keychain.setInternetCredentials(svc, username, password);
      return true;
    } catch (error) {
      console.error('Error saving internet credentials:', error);
      return false;
    }
  },

  getInternetCredentials: async (
    server: string | undefined,
  ): Promise<Credentials | null> => {
    try {
      const svc = server || `${KEYCHAIN_SERVICE}_INTERNET`;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const creds = await Keychain.getInternetCredentials(svc);
      if (creds && creds.username && creds.password) {
        return { username: creds.username, password: creds.password };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving internet credentials:', error);
      return null;
    }
  },

  deleteInternetCredentials: async (
    server: string | undefined,
  ): Promise<boolean> => {
    try {
      const svc = server || `${KEYCHAIN_SERVICE}_INTERNET`;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await Keychain.resetInternetCredentials(svc);
      return true;
    } catch (error) {
      console.error('Error deleting internet credentials:', error);
      return false;
    }
  },
};

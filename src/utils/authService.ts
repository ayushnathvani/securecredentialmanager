// Commented out temporarily to fix app crash - uncomment after installing Firebase
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut as firebaseSignOut,
//   onAuthStateChanged,
//   User
// } from 'firebase/auth';
// import { auth } from './firebase';
import { keychainService } from './keychainService';
// import { uploadAllKeychainData, restoreAllKeychainData } from './credentialSync';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

/**
 * Auth service that integrates Firebase Auth with keychain data sync
 * DISABLED UNTIL FIREBASE IS PROPERLY INSTALLED
 */
export const authService = {
  /**
   * Sign up with email and password - DISABLED
   */
  signUp: async (
    email: string,
    password: string,
    syncPassphrase: string,
  ): Promise<AuthUser | null> => {
    console.log('Firebase not configured yet - signUp disabled');
    console.log('Installing Firebase and uncommenting imports to enable');
    return null;
  },

  /**
   * Sign in with email and password - DISABLED
   */
  signIn: async (
    email: string,
    password: string,
    syncPassphrase?: string,
    shouldRestore: boolean = false,
  ): Promise<AuthUser | null> => {
    console.log('Firebase not configured yet - signIn disabled');
    console.log('Installing Firebase and uncommenting imports to enable');
    return null;
  },

  /**
   * Sign in using biometric credentials stored locally
   */
  signInWithBiometrics: async (
    syncPassphrase?: string,
  ): Promise<AuthUser | null> => {
    try {
      const creds = await keychainService.getCredentialsWithBiometrics(
        undefined,
        'Use biometrics to sign in',
      );

      if (!creds) {
        throw new Error('No biometric credentials found');
      }

      console.log('Biometric credentials found but Firebase signin disabled');
      console.log('Username:', creds.username);
      return null;
    } catch (error) {
      console.error('Biometric sign in error:', error);
      return null;
    }
  },

  /**
   * Sign out user and optionally clear local data
   */
  signOut: async (clearLocalData: boolean = false): Promise<boolean> => {
    try {
      await keychainService.clearAuthState();

      if (clearLocalData) {
        // Clear all local keychain data
        await keychainService.deleteCredentials();
        await keychainService.deleteToken();
        await keychainService.deleteMPIN();
      }

      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  },

  /**
   * Restore session from keychain on app startup
   */
  restoreSession: async (): Promise<AuthUser | null> => {
    try {
      // First check if user was previously logged in
      const wasLoggedIn = await keychainService.getAuthState();
      if (!wasLoggedIn) {
        return null;
      }

      // Try to restore using biometric credentials
      const creds = await keychainService.getCredentialsWithBiometrics(
        undefined,
        'Authenticate to restore your session',
      );

      if (creds) {
        console.log('Local session restored (Firebase disabled)');
        return {
          uid: 'local-user',
          email: creds.username,
          displayName: null,
        };
      }

      return null;
    } catch (error) {
      console.error('Session restore error:', error);
      await keychainService.clearAuthState();
      return null;
    }
  },

  /**
   * Get current user - DISABLED
   */
  getCurrentUser: (): any | null => {
    console.log('Firebase not configured - getCurrentUser disabled');
    return null;
  },

  /**
   * Listen to auth state changes - DISABLED
   */
  onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
    console.log('Firebase not configured - onAuthStateChange disabled');
    return () => {};
  },

  /**
   * Manual sync of keychain data to Firebase - DISABLED
   */
  syncKeychainData: async (syncPassphrase: string): Promise<boolean> => {
    console.log('Firebase not configured - syncKeychainData disabled');
    return false;
  },

  /**
   * Manual restore of keychain data from Firebase - DISABLED
   */
  restoreKeychainData: async (syncPassphrase: string): Promise<boolean> => {
    console.log('Firebase not configured - restoreKeychainData disabled');
    return false;
  },
};

// Commented out temporarily to fix app crash - uncomment after installing Firebase
// import CryptoJS from 'crypto-js';
// import { doc, setDoc, getDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
// import { firestore } from './firebase';
import { keychainService } from './keychainService';

/**
 * Encrypt a JSON payload using AES with a passphrase - DISABLED UNTIL FIREBASE SETUP
 */
export function encryptPayload(payload: object, _passphrase: string): string {
  console.log('Firebase not configured yet');
  return 'disabled';
  // const plaintext = JSON.stringify(payload);
  // return CryptoJS.AES.encrypt(plaintext, passphrase).toString();
}

/**
 * Decrypt AES-encrypted string using passphrase - DISABLED UNTIL FIREBASE SETUP
 */
export function decryptPayload(
  _encrypted: string,
  _passphrase: string,
): object | null {
  console.log('Firebase not configured yet');
  return null;
  // try {
  //   const bytes = CryptoJS.AES.decrypt(encrypted, passphrase);
  //   const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  //   if (!decrypted) return null;
  //   return JSON.parse(decrypted);
  // } catch (err) {
  //   console.error('Decryption failed', err);
  //   return null;
  // }
}

/**
 * Enhanced saveInternetCredentials - saves to keychain (Firebase sync disabled)
 */
export async function saveInternetCredentialsWithSync(
  server: string | undefined,
  username: string,
  password: string,
  _uid: string,
  _syncPassphrase: string,
): Promise<boolean> {
  try {
    const svc = server || 'SecureCredentialManager_INTERNET';

    // Save to local keychain using existing function
    const localSaved = await keychainService.saveInternetCredentials(
      svc,
      username,
      password,
    );

    if (!localSaved) {
      console.error('Failed to save credentials to local keychain');
      return false;
    }

    console.log(
      `Credentials saved locally for service: ${svc} (Firebase sync disabled)`,
    );
    console.log(
      'To enable Firebase sync, uncomment Firebase imports and install dependencies',
    );
    return true;
  } catch (error) {
    console.error('Error saving internet credentials:', error);
    return false;
  }
}

/**
 * Enhanced getInternetCredentials - gets from keychain (Firebase restore disabled)
 */
export async function getInternetCredentialsWithRestore(
  server: string | undefined,
  _uid?: string,
  _syncPassphrase?: string,
): Promise<{ username: string; password: string } | null> {
  try {
    const svc = server || 'SecureCredentialManager_INTERNET';

    // Get from local keychain
    const localCreds = await keychainService.getInternetCredentials(svc);

    if (localCreds) {
      console.log(
        `Retrieved credentials from local keychain for service: ${svc}`,
      );
      return localCreds;
    }

    console.log(
      `No credentials found for service: ${svc} (Firebase restore disabled)`,
    );
    return null;
  } catch (error) {
    console.error('Error getting internet credentials:', error);
    return null;
  }
}

/**
 * Enhanced deleteInternetCredentials - deletes from keychain (Firebase delete disabled)
 */
export async function deleteInternetCredentialsWithSync(
  server: string | undefined,
  _uid?: string,
): Promise<boolean> {
  try {
    const svc = server || 'SecureCredentialManager_INTERNET';

    // Delete from local keychain
    const localDeleted = await keychainService.deleteInternetCredentials(svc);

    if (localDeleted) {
      console.log(
        `Credentials deleted locally for service: ${svc} (Firebase delete disabled)`,
      );
    }

    return localDeleted;
  } catch (error) {
    console.error('Error deleting internet credentials:', error);
    return false;
  }
}

export default {
  encryptPayload,
  decryptPayload,
  saveInternetCredentialsWithSync,
  getInternetCredentialsWithRestore,
  deleteInternetCredentialsWithSync,
};

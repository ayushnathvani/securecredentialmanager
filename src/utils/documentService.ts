import { keychainService } from './keychainService';
import CryptoJS from 'crypto-js';

export interface SecureDocument {
  id: string;
  name: string;
  type: 'statement' | 'invoice' | 'report' | 'other';
  size: string;
  downloaded: boolean;
  encryptedAt?: number;
}

const DOCUMENT_KEY_PREFIX = 'doc_';
const DOCUMENT_LIST_KEY = 'document_list';

export const documentService = {
  /**
   * Save encrypted document
   */
  saveEncryptedDocument: async (
    documentId: string,
    documentName: string,
    documentType: string,
    documentData: string,
    promptMessage?: string,
  ): Promise<boolean> => {
    try {
      // Generate encryption key from keychain
      const encryptionKey = await documentService.getOrCreateEncryptionKey(
        promptMessage,
      );

      if (!encryptionKey) {
        console.error('Failed to get encryption key');
        return false;
      }

      // Encrypt document data
      const encryptedData = CryptoJS.AES.encrypt(
        documentData,
        encryptionKey,
      ).toString();

      // Store encrypted document
      const documentKey = `${DOCUMENT_KEY_PREFIX}${documentId}`;
      const success = await keychainService.saveSensitiveData(
        documentKey,
        encryptedData,
        true, // Use biometric protection
      );

      if (success) {
        // Update document list
        await documentService.addToDocumentList({
          id: documentId,
          name: documentName,
          type: documentType as any,
          size: `${Math.round(encryptedData.length / 1024)} KB`,
          downloaded: true,
          encryptedAt: Date.now(),
        });
      }

      return success;
    } catch (error) {
      console.error('Error saving encrypted document:', error);
      return false;
    }
  },

  /**
   * Get decrypted document
   */
  getDecryptedDocument: async (
    documentId: string,
    promptMessage?: string,
  ): Promise<string | null> => {
    try {
      // Get encryption key from keychain
      const encryptionKey = await documentService.getOrCreateEncryptionKey(
        promptMessage,
      );

      if (!encryptionKey) {
        console.error('Failed to get encryption key');
        return null;
      }

      // Retrieve encrypted document
      const documentKey = `${DOCUMENT_KEY_PREFIX}${documentId}`;
      const encryptedData = await keychainService.getSensitiveData(
        documentKey,
        true, // Use biometric protection
        promptMessage,
      );

      if (!encryptedData) {
        console.error('Document not found');
        return null;
      }

      // Decrypt document
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      return decryptedData;
    } catch (error) {
      console.error('Error getting decrypted document:', error);
      return null;
    }
  },

  /**
   * Delete document
   */
  deleteDocument: async (documentId: string): Promise<boolean> => {
    try {
      const documentKey = `${DOCUMENT_KEY_PREFIX}${documentId}`;
      const success = await keychainService.deleteSensitiveData(
        documentKey,
        true,
      );

      if (success) {
        // Remove from document list
        await documentService.removeFromDocumentList(documentId);
      }

      return success;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  },

  /**
   * Get list of downloaded documents
   */
  getDocumentList: async (): Promise<SecureDocument[]> => {
    try {
      const listJson = await keychainService.getSensitiveData(
        DOCUMENT_LIST_KEY,
        false,
      );

      if (!listJson) {
        return [];
      }

      return JSON.parse(listJson);
    } catch (error) {
      console.error('Error getting document list:', error);
      return [];
    }
  },

  /**
   * Add document to list
   */
  addToDocumentList: async (document: SecureDocument): Promise<void> => {
    try {
      const list = await documentService.getDocumentList();
      const existingIndex = list.findIndex(d => d.id === document.id);

      if (existingIndex >= 0) {
        list[existingIndex] = document;
      } else {
        list.push(document);
      }

      await keychainService.saveSensitiveData(
        DOCUMENT_LIST_KEY,
        JSON.stringify(list),
        false,
      );
    } catch (error) {
      console.error('Error adding to document list:', error);
    }
  },

  /**
   * Remove document from list
   */
  removeFromDocumentList: async (documentId: string): Promise<void> => {
    try {
      const list = await documentService.getDocumentList();
      const filteredList = list.filter(d => d.id !== documentId);

      await keychainService.saveSensitiveData(
        DOCUMENT_LIST_KEY,
        JSON.stringify(filteredList),
        false,
      );
    } catch (error) {
      console.error('Error removing from document list:', error);
    }
  },

  /**
   * Get or create encryption key for documents
   */
  getOrCreateEncryptionKey: async (
    promptMessage?: string,
  ): Promise<string | null> => {
    try {
      const keyName = 'document_encryption_key';

      // Try to get existing key
      let key = await keychainService.getSensitiveData(
        keyName,
        true,
        promptMessage,
      );

      if (!key) {
        // Generate new key
        key = CryptoJS.lib.WordArray.random(32).toString();

        // Save with biometric protection
        await keychainService.saveSensitiveData(keyName, key, true);
      }

      return key;
    } catch (error) {
      console.error('Error getting/creating encryption key:', error);
      return null;
    }
  },

  /**
   * Clear all documents
   */
  clearAllDocuments: async (): Promise<boolean> => {
    try {
      const list = await documentService.getDocumentList();

      for (const doc of list) {
        await documentService.deleteDocument(doc.id);
      }

      await keychainService.deleteSensitiveData(DOCUMENT_LIST_KEY, false);
      return true;
    } catch (error) {
      console.error('Error clearing all documents:', error);
      return false;
    }
  },
};

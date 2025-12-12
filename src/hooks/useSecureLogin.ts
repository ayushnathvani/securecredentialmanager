import { useState, useEffect } from 'react';
import {
  keychainService,
  mockLogin,
  generateToken,
  getTokenExpiryDate,
} from '../utils';

export const useSecureLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  // Load saved credentials when component mounts
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const credentials = await keychainService.getCredentials();
      if (credentials) {
        setSavedCredentials(credentials);
        setShowSuggestion(true);
      }
    } catch (err) {
      console.error('Error loading saved credentials:', err);
    }
  };

  const useSavedCredentials = () => {
    if (savedCredentials) {
      setUsername(savedCredentials.username);
      setPassword(savedCredentials.password);
      setShowSuggestion(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setSuccess(false);

    if (!username || !password) {
      setError('Please enter both username and password');
      return false;
    }

    setLoading(true);

    try {
      const result = await mockLogin(username, password);

      if (result.success && result.token) {
        // Save credentials to keychain for future auto-fill
        await keychainService.saveCredentials(username, password);

        // Save auth token
        const expiresAt = getTokenExpiryDate(24);
        await keychainService.saveToken(result.token, expiresAt);

        setSuccess(true);
        setSavedCredentials({ username, password });
        setShowSuggestion(false);
        return true;
      } else {
        setError(result.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearToken = async () => {
    await keychainService.deleteToken();
    setSuccess(false);
  };

  const clearSavedCredentials = async () => {
    await keychainService.deleteCredentials();
    setSavedCredentials(null);
    setShowSuggestion(false);
    setUsername('');
    setPassword('');
  };

  const reloadCredentials = () => {
    loadSavedCredentials();
  };

  return {
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
  };
};

/**
 * Secure Credential Manager
 * React Native Keychain Authentication Demos
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigation';
import { colors } from './src/utils';

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <AppNavigator />
    </>
  );
}

export default App;

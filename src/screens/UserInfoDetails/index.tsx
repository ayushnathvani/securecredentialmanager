import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TextInput, Button, Card } from '../../components';
import { keychainService } from '../../utils/keychainService';
import { colors } from '../../utils';

type RootStackParamList = {
  Home: undefined;
  UserInfoDetails: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserInfoDetails'>;
};

const UserInfoDetails: React.FC<Props> = ({ navigation }) => {
  const [server, setServer] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Optionally load existing saved internet creds for default server
    const load = async () => {
      try {
        const svc = '';
        const creds = await keychainService.getInternetCredentials(
          svc || undefined,
        );
        if (creds) {
          setUsername(creds.username);
          setPassword(creds.password);
        }
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setSaving(true);
    try {
      const svc = server?.trim() ? server.trim() : undefined;
      const success = await keychainService.saveInternetCredentials(
        svc,
        username,
        password,
      );
      if (success) {
        Alert.alert('Success', 'Credentials saved to device keychain', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', 'Failed to save credentials');
      }
    } catch (error) {
      console.error('Error saving internet credentials:', error);
      Alert.alert('Error', 'Failed to save credentials');
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async () => {
    try {
      const svc = server?.trim() ? server.trim() : undefined;
      const creds = await keychainService.getInternetCredentials(svc);
      if (creds) {
        setUsername(creds.username);
        setPassword(creds.password);
        Alert.alert('Loaded', 'Credentials loaded from keychain');
      } else {
        Alert.alert(
          'Not Found',
          'No credentials found for the specified server',
        );
      }
    } catch (error) {
      console.error('Error loading internet credentials:', error);
      Alert.alert('Error', 'Failed to load credentials');
    }
  };

  const handleDelete = async () => {
    try {
      const svc = server?.trim() ? server.trim() : undefined;
      const success = await keychainService.deleteInternetCredentials(svc);
      if (success) {
        Alert.alert('Deleted', 'Credentials deleted from keychain', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', 'Failed to delete credentials');
      }
    } catch (error) {
      console.error('Error deleting internet credentials:', error);
      Alert.alert('Error', 'Failed to delete credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>User Info / Credentials</Text>

        <TextInput
          label="Server (optional)"
          value={server}
          onChangeText={setServer}
          placeholder="example.com (leave empty to use local key)"
        />

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="username"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="password"
          secureTextEntry
        />

        <Button
          title={saving ? 'Saving...' : 'Save to Keychain'}
          onPress={handleSave}
          loading={saving}
        />

        <View style={styles.row}>
          <Button
            title="Load"
            onPress={handleLoad}
            style={styles.smallButton}
          />
          <Button
            title="Delete"
            onPress={handleDelete}
            style={{ ...styles.smallButton, ...styles.delete }}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  card: { padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  smallButton: { flex: 1, marginRight: 8 },
  delete: { backgroundColor: colors.error },
});

export default UserInfoDetails;

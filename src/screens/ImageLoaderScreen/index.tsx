import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Button } from '../../components';
import { styles } from './styles';
import {
  businessImg,
  regularImg,
  regularminivanImg,
  businessminivanImg,
} from '../../utils/images';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ImageLoader'
>;

const ImageLoaderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const images = [
    { uri: businessImg, label: 'Business' },
    { uri: regularImg, label: 'Regular' },
    { uri: regularminivanImg, label: 'Regular Minivan' },
    { uri: businessminivanImg, label: 'Business Minivan' },
  ];

  const FastImageModule: any = useMemo(() => {
    try {
      // require at runtime to avoid crashing when native module isn't linked yet
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('react-native-fast-image');
      return mod && mod.default ? mod.default : mod;
    } catch (e) {
      console.warn(
        'react-native-fast-image not available, falling back to Image',
      );
      return null;
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pickup-time Images</Text>

      {images.map(img => (
        <View key={img.uri} style={styles.card}>
          <Text style={styles.label}>{img.label}</Text>
          {FastImageModule ? (
            <FastImageModule
              style={styles.image}
              source={{
                uri: img.uri,
                priority: FastImageModule.priority?.normal,
              }}
              resizeMode={FastImageModule.resizeMode?.contain}
            />
          ) : (
            <Image
              style={styles.image}
              source={{ uri: img.uri }}
              resizeMode="contain"
            />
          )}
        </View>
      ))}

      <Button title="Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

export default ImageLoaderScreen;

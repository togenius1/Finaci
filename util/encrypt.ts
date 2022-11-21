import AsyncStorage from '@react-native-async-storage/async-storage';
import {box} from 'tweetnacl';

import {
  encrypt,
  getMySecretKey,
  PUBLIC_KEY,
  stringToUint8Array,
} from './crypto';

// Encryption
export const encryption = async (json: any) => {
  const ourSecretKey = await getMySecretKey();
  const ourPublicKey = await AsyncStorage.getItem(PUBLIC_KEY);
  // console.log(ourPublicKey);

  if (!ourSecretKey || !ourPublicKey) {
    return;
  }

  const sharedKey = box.before(stringToUint8Array(ourPublicKey), ourSecretKey);
  const encrypted = encrypt(sharedKey, json);

  return encrypted;
};

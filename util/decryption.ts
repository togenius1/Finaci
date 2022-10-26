import AsyncStorage from '@react-native-async-storage/async-storage';
import {box} from 'tweetnacl';
import {decrypt, getMySecretKey, stringToUint8Array} from './crypto';

export const PUBLIC_KEY = 'PUBLIC_KEY';

// Decryption
export const decryption = async encryptedData => {
  const ourSecretKey = await getMySecretKey();
  const ourPublicKey = await AsyncStorage.getItem(PUBLIC_KEY);
  if (!ourSecretKey || !ourPublicKey) {
    return;
  }

  // decrypt message.content
  const sharedKey = box.before(stringToUint8Array(ourPublicKey), ourSecretKey);
  const decrypted = decrypt(sharedKey, encryptedData);

  return decrypted;
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import {box} from 'tweetnacl';
import {decrypt, stringToUint8Array} from './crypto';

export const PRIVATE_KEY = 'PRIVATE_KEY';
export const PUBLIC_KEY = 'PUBLIC_KEY';

// Decryption
export const decryption = async encryptedObj => {
  const ourSecretKey = await AsyncStorage.getItem(PRIVATE_KEY);
  const ourPublicKey = await AsyncStorage.getItem(PUBLIC_KEY);
  if (!ourSecretKey || !ourPublicKey) {
    return;
  }
  // decrypt message.content
  const sharedKey = box.before(
    stringToUint8Array(ourPublicKey),
    stringToUint8Array(ourSecretKey),
  );
  // console.log('sharedKey', sharedKey);
  const decrypted = decrypt(sharedKey, encryptedObj);
  return decrypted;
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import {box} from 'tweetnacl';

import {encrypt, generateKeyPair, stringToUint8Array} from './crypto';

export const PRIVATE_KEY = 'PRIVATE_KEY';
export const PUBLIC_KEY = 'PUBLIC_KEY';

// Encryption
export const encryption = async obj => {
  updateKeyPair();
  const ourSecretKey = await AsyncStorage.getItem(PRIVATE_KEY);
  const ourPublicKey = await AsyncStorage.getItem(PUBLIC_KEY);
  if (!ourSecretKey || !ourPublicKey) {
    return;
  }
  // console.log('private key ', ourSecretKey);
  const sharedKey = box.before(
    stringToUint8Array(ourPublicKey),
    stringToUint8Array(ourSecretKey),
  );
  // console.log('shared key ', sharedKey);
  const encryptedObject = encrypt(sharedKey, obj);
  // console.log('encrypted message ', encryptedObject);
  return encryptedObject;
};

// Generate Key
const updateKeyPair = async () => {
  // generate private/public key
  const {publicKey, secretKey} = generateKeyPair();
  // save private key to Async storage
  await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
  await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());
};

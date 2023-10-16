import AsyncStorage from '@react-native-async-storage/async-storage';
import {box} from 'tweetnacl';

import {
  decrypt,
  getMySecretKey,
  PUBLIC_KEY,
  stringToUint8Array,
} from './crypto';

// Decryption
export const decryption = async (
  obj: any,
  privateKey: string,
  publicKey: string,
) => {
  const ourSecretKey = privateKey;
  const ourPublicKey = publicKey;
  if (!ourSecretKey || !ourPublicKey) {
    return;
  }

  const encrypted = String(Object.values(JSON.parse(obj))[0]);

  const sharedKey = box.before(
    stringToUint8Array(ourPublicKey),
    stringToUint8Array(ourSecretKey),
  );
  const decrypted = decrypt(sharedKey, encrypted);

  return decrypted;
};

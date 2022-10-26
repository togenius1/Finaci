import AsyncStorage from '@react-native-async-storage/async-storage';
import {box} from 'tweetnacl';

import {encrypt, getMySecretKey, stringToUint8Array} from './crypto';


export const PUBLIC_KEY = 'PUBLIC_KEY';

// Encryption
export const encryption = async obj => {
  const ourSecretKey = await getMySecretKey();
  const ourPublicKey = await AsyncStorage.getItem(PUBLIC_KEY);

  if (!ourSecretKey || !ourPublicKey) {
    return;
  }
  // console.log('private key ', ourSecretKey);
  const sharedKey = box.before(stringToUint8Array(ourPublicKey), ourSecretKey);
  // console.log('shared key ', sharedKey);
  const encryptedObject = encrypt(sharedKey, obj);
  // console.log('encrypted message ', encryptedObject);
  return encryptedObject;
};

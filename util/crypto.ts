import AsyncStorage from '@react-native-async-storage/async-storage';
import {box, randomBytes} from 'tweetnacl';
import {v4 as randomByte} from 'uuid';
import {decode as decodeUTF8, encode as encodeUTF8} from '@stablelib/utf8';

import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';

export const PRIVATE_KEY = 'PRIVATE_KEY';
export const PUBLIC_KEY = 'PUBLIC_KEY';

export const PRNG = (x, n) => {
  // ... copy n random bytes into x ...
  const randomBytes = randomByte(n);

  for (let i = 0; i < n; i++) {
    x[i] = randomBytes[i];
  }
};

const newNonce = () => randomBytes(box.nonceLength);
export const generateKeyPair = () => box.keyPair();
export const generatePublicKeyFromSecretKey = (privateKey: Uint8Array) =>
  box.keyPair.fromSecretKey(privateKey);

// ENCRYPTION
export const encrypt = (
  secretOrSharedKey: Uint8Array,
  json: any,
  key?: Uint8Array,
) => {
  const nonce = newNonce();
  const messageUint8 = encodeUTF8(JSON.stringify(json));
  const encrypted = key
    ? box(messageUint8, nonce, key, secretOrSharedKey)
    : box.after(messageUint8, nonce, secretOrSharedKey);

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

// DECRYPTION
export const decrypt = (
  secretOrSharedKey: Uint8Array,
  messageWithNonce: string,
  key?: Uint8Array,
) => {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce?.length,
  );

  const decrypted = key
    ? box.open(message, nonce, key, secretOrSharedKey)
    : box.open.after(message, nonce, secretOrSharedKey);

  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }

  const base64DecryptedMessage = decodeUTF8(decrypted);
  return JSON.parse(base64DecryptedMessage);
};

export const stringToUint8Array = (content: string) =>
  Uint8Array.from(content.split(',').map(str => parseInt(str)));

export const getMySecretKey = async () => {
  const keyString = await AsyncStorage.getItem(PRIVATE_KEY);
  if (!keyString) {
    // Alert.alert(
    //   "You haven't set your keypair yet",
    //   'Go to settings, and generate a new keypair',
    //   [
    //     {
    //       text: 'Open setting',
    //       // onPress: () => navigation.navigate('Settings'),
    //     },
    //   ],
    // );
    return;
  }

  return stringToUint8Array(keyString);
};

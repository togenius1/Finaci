import {ActivityIndicator, StatusBar, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Amplify, Auth, DataStore, Hub} from 'aws-amplify';

import {setPRNG} from 'tweetnacl';

import awsconfig from './src/aws-exports';
import {
  generateKeyPair,
  generatePublicKeyFromSecretKey,
  PRIVATE_KEY,
  PRNG,
  PUBLIC_KEY,
  stringToUint8Array,
} from './util/crypto';
import FinnerNavigator from './navigation/FinnerNavigator';
import {BackupKey, User} from './src/models';

Amplify.configure(awsconfig);

setPRNG(PRNG);

const App = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState();

  // const dispatch = useAppDispatch();
  // // const dataLoaded = useAppSelector(store => store);

  // useEffect(() => {
  //   dispatch(fetchExpensesData());
  // }, []);

  // console.log('authenticatedUser ', authenticatedUser);

  // Listening for Login events.
  useEffect(() => {
    const listener = data => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut') {
        checkUser();
      }
    };
    Hub.listen('auth', listener);

    return () => Hub.remove('auth', listener);
  }, []);

  // Check if authenticated user.
  useEffect(() => {
    checkUser();
  }, []);

  // Check Key
  useEffect(() => {
    checkKey();
  }, []);

  // Check if authenticated user.
  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      setAuthenticatedUser(authUser);
    } catch (e) {
      setAuthenticatedUser(null);
    }
  };

  // Check Key
  const checkKey = async () => {
    const userId = authenticatedUser?.attributes?.sub;
    const pKeyObj = (await DataStore.query(BackupKey))
      .filter(bk => bk?.User?.id === userId)
      .map(bk => bk.key);

    let pKeyFromCloud = pKeyObj[0];
    let pKeyFromLocal = await AsyncStorage.getItem(PRIVATE_KEY);

    // Check if the backup key is in Local Storage and Cloud.
    if (pKeyFromLocal === undefined && pKeyFromCloud === undefined) {
      // Generate a new backup key.
      const {publicKey, secretKey} = generateKeyPair();
      //Save Key to local storage.
      await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
      await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());

      // Save Private Key to DB.
      await DataStore.save(
        new BackupKey({
          key: String(secretKey),
        }),
      );
    }

    // Check if it doesn't found key on Local Storage.
    if (pKeyFromLocal === undefined && pKeyFromCloud !== undefined) {
      await AsyncStorage.setItem(PRIVATE_KEY, String(pKeyFromCloud));
      const publicKey = generatePublicKeyFromSecretKey(
        stringToUint8Array(String(pKeyFromCloud)),
      );
      await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());
    }

    // Check if it doesn't found key on Cloud.
    if (pKeyFromLocal !== undefined && pKeyFromCloud === undefined) {
      const originalBackup = await DataStore.query(BackupKey, userId);
      let saveKeyObj;
      // Create a new backup key.
      if (originalBackup === undefined) {
        saveKeyObj = await DataStore.save(
          new BackupKey({
            key: String(pKeyFromLocal),
          }),
        );
      } else {
        saveKeyObj = await DataStore.save(
          User.copyOf(originalBackup, updated => {
            updated.key = String(pKeyFromLocal);
          }),
        );
      }

      // Update a backup key id in User table.
      const originalUser = await DataStore.query(User, userId);
      await DataStore.save(
        User.copyOf(originalUser, updated => {
          updated.userBackupKeyId = saveKeyObj?.id;
        }),
      );
    }
    console.log('key from Cloud: ', pKeyObj[0]);
    console.log('key from Local: ', pKeyFromLocal);
  };

  if (authenticatedUser === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <FinnerNavigator authenticatedUser={authenticatedUser} />
    </>
  );
};

export default App;

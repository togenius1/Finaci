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

  // Check Key
  const checkKey = async () => {
    const users = await DataStore.query(User);
    const keyObj = await DataStore.query(BackupKey);

    console.log('users: ', users);
    console.log('keyObj: ', keyObj);

    // let pKeyFromLocal = await AsyncStorage.getItem(PRIVATE_KEY);
    // let pKeyFromCloud = pKeyObj;
    // // Check if the backup key is in Local Storage and Cloud.
    // if (pKeyFromLocal === null && pKeyFromCloud === null) {
    //   // Generate a new backup key.
    //   const {publicKey, secretKey} = generateKeyPair();
    //   //Save Key to local storage.
    //   await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
    //   await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());

    //   // Save Private Key to DB.
    //   const savedToCloudKey = await DataStore.save(
    //     new BackupKey({
    //       key: secretKey,
    //     }),
    //   );
    // }

    // // Check if it doesn't found key on Local Storage.
    // if (pKeyFromLocal === null && pKeyFromCloud !== null) {
    //   // Load a key from cloud save it to local storage.
    //   await AsyncStorage.setItem(PRIVATE_KEY, pKeyFromCloud.toString());
    //   // Generate a public key from private key and save to local storage.
    //   const publicKey = generatePublicKeyFromSecretKey(
    //     stringToUint8Array(pKeyFromCloud),
    //   );
    //   await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());
    // }

    // // Check if it doesn't found key on Cloud.
    // if (pKeyFromLocal !== null && pKeyFromCloud === null) {
    //   // Save a key from Local Storage to Cloud.
    // }
  };

  // Check if authenticated user.
  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      setAuthenticatedUser(authUser);
    } catch (e) {
      setAuthenticatedUser(null);
    }
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

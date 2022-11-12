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
  // Generate new key
  const generateNewKey = async (
    userId: string,
    userBackupId: string | null | undefined,
  ) => {
    // Generate a new backup key.
    const {publicKey, secretKey} = generateKeyPair();
    //Save Key to local storage.
    await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
    await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());

    // Save Private Key to DB.
    const originalBackup = await DataStore.query(BackupKey, userBackupId);
    let saveKeyObj;
    // Create a new backup key.
    if (originalBackup === undefined) {
      saveKeyObj = await DataStore.save(
        new BackupKey({
          key: String(secretKey),
        }),
      );
    } else {
      saveKeyObj = await DataStore.save(
        BackupKey.copyOf(originalBackup, updated => {
          updated.key = String(secretKey);
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
  };

  // Load Key from Cloud
  const saveCloudKeyToLocal = async (cloudPrivateKey: string) => {
    await AsyncStorage.setItem(PRIVATE_KEY, cloudPrivateKey);
    const publicKey = generatePublicKeyFromSecretKey(
      stringToUint8Array(String(cloudPrivateKey)),
    );
    await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());
  };

  // Check Key
  const checkKey = async () => {
    const userId = (await DataStore.query(User))[0].id;
    const userBackupId = (await DataStore.query(User))[0].userBackupKeyId;
    let cloudPrivateKey = (await DataStore.query(BackupKey))
      .filter(bk => bk.id === userBackupId)
      .map(bk => bk.key)[0];
    let localPrivateKey = await AsyncStorage.getItem(PRIVATE_KEY);

    // await AsyncStorage.removeItem(PRIVATE_KEY);
    console.log('localPrivateKey: ', localPrivateKey);
    console.log('cloudPrivateKey: ', String(cloudPrivateKey));

    // Check if the backup key is in Local Storage and Cloud.
    if (
      (localPrivateKey === undefined || localPrivateKey === null) &&
      (cloudPrivateKey === undefined || cloudPrivateKey === null)
    ) {
      console.log('-------------Generate New Key');
      await generateNewKey(userId, userBackupId);
    }
    // // Check if it doesn't found key on Local Storage.
    if (
      (localPrivateKey === undefined || localPrivateKey === null) &&
      (cloudPrivateKey !== undefined || cloudPrivateKey !== null)
    ) {
      console.log('---------------Cloud To Local Storage');
      await saveCloudKeyToLocal(String(cloudPrivateKey));
    }

    // // Check if it doesn't found key on Cloud.
    if (
      (localPrivateKey !== undefined || localPrivateKey !== null) &&
      (cloudPrivateKey === undefined || cloudPrivateKey === null)
    ) {
      console.log('--------------- Upload to Cloud');
      await uploadLocalKeyToCloud(
        userId,
        String(userBackupId),
        String(localPrivateKey),
      );
    }
  };

  const uploadLocalKeyToCloud = async (
    userId: string,
    userBackupId: string,
    localPrivateKey: string,
  ) => {
    const originalBackup = await DataStore.query(BackupKey, userBackupId);
    console.log(originalBackup);
    let saveKeyObj;
    // Create a new backup key.
    if (originalBackup === undefined) {
      saveKeyObj = await DataStore.save(
        new BackupKey({
          key: localPrivateKey,
        }),
      );
    } else {
      saveKeyObj = await DataStore.save(
        BackupKey.copyOf(originalBackup, updated => {
          updated.key = localPrivateKey;
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

import {ActivityIndicator, StatusBar, View} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import Button from './components/UI/Button';

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
  }, [authenticatedUser]);

  // Check if authenticated user.
  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      setAuthenticatedUser(authUser);
    } catch (e) {
      setAuthenticatedUser(null);
    }
  };

  // Remove Key in Local Storage.

  const removeKey = async () => {
    await AsyncStorage.removeItem(PRIVATE_KEY);
    await AsyncStorage.removeItem(PUBLIC_KEY);
    console.log('Deleted PRIVATE_KEY completely');
  };

  // Check Key
  const checkKey = async () => {
    const userSub = authenticatedUser?.attributes?.sub;
    const currentUser = (await DataStore.query(User)).filter(
      user => user?.id === userSub,
    )[0];

    let cloudPrivateKey = currentUser?.backupKey;
    let localPrivateKey = await AsyncStorage.getItem(PRIVATE_KEY);

    const publicKey = await AsyncStorage.getItem(PUBLIC_KEY);

    console.log('cloudPrivateKey: ', cloudPrivateKey);
    console.log('localPrivateKey: ', localPrivateKey);
    console.log('publicKey: ', publicKey);

    // Check if the backup key is in Local Storage and Cloud.
    if (
      (localPrivateKey === null || cloudPrivateKey === undefined) &&
      (cloudPrivateKey === null || cloudPrivateKey === undefined)
    ) {
      console.log('-------------Generate New Key');
      await generateNewKey(currentUser);
    }

    // Check if it doesn't found key on Local Storage.
    // if (
    //   (localPrivateKey === undefined || localPrivateKey === null) &&
    //   cloudPrivateKey !== undefined &&
    //   cloudPrivateKey !== null
    // ) {
    //   console.log('---------------Cloud To Local Storage');
    //   await saveCloudKeyToLocal(String(cloudPrivateKey));
    // }

    // // Check if it doesn't found key on Cloud.
    // if (
    //   (localPrivateKey !== undefined || localPrivateKey !== null) &&
    //   (cloudPrivateKey === undefined || cloudPrivateKey === null)
    // ) {
    //   console.log('--------------- Upload to Cloud');
    //   await uploadLocalKeyToCloud(
    //     userId,
    //     String(userBackupId),
    //     String(localPrivateKey),
    //   );
    // }
  };

  // Generate new key
  const generateNewKey = async currentUser => {
    // Remove old key
    await AsyncStorage.removeItem(PUBLIC_KEY);

    // Generate a new backup key.
    const {publicKey, secretKey} = generateKeyPair();

    //Save Key to local storage.
    await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
    await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());

    // Update a backup key id in User table.
    const originalUser = currentUser;
    await DataStore.save(
      User.copyOf(originalUser, updated => {
        updated.backupKey = String(secretKey);
      }),
    );
  };

  // Load Key from Cloud
  const saveCloudKeyToLocal = async (cloudPrivateKey: string) => {
    await AsyncStorage.setItem(PRIVATE_KEY, cloudPrivateKey);
    const newPublicKey = generatePublicKeyFromSecretKey(
      stringToUint8Array(String(cloudPrivateKey)),
    );
    await AsyncStorage.setItem(PUBLIC_KEY, newPublicKey.toString());

    console.log('Private Key: ', cloudPrivateKey);
    console.log('PublicKey Key: ', newPublicKey);
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
      {authenticatedUser && <Button onPress={removeKey}>Remove Key</Button>}
    </>
  );
};

export default App;

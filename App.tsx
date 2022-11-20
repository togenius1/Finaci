import {StatusBar, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {setPRNG} from 'tweetnacl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Amplify, Auth, DataStore, Hub} from 'aws-amplify';

import awsconfig from './src/aws-exports';
import {
  generateKeyPair,
  generatePublicKeyFromSecretKey,
  getMySecretKey,
  PRIVATE_KEY,
  PRNG,
  PUBLIC_KEY,
  stringToUint8Array,
} from './util/crypto';
import FinnerNavigator from './navigation/FinnerNavigator';
import {EagerUser, User} from './src/models';
import CButton from './components/UI/CButton';

Amplify.configure(awsconfig);

setPRNG(PRNG);

const App = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [user, setUser] = useState<EagerUser | undefined>();
  const [cloudPrivateKey, setCloudPrivateKey] = useState<string | null>();
  const [localPrivateKey, setLocalPrivateKey] = useState<string | null>();

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

  console.log('cloudPrivateKey: ', cloudPrivateKey);
  console.log('localPrivateKey: ', localPrivateKey);
  // console.log('loggedIn:------ ', loggedIn);

  // Check if authenticated user.
  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      // const authUser = await Auth.currentAuthenticatedUser();
      const dbUser = await DataStore.query(User, authUser.attributes.sub);
      setUser(dbUser);

      const cloudPKey = String(dbUser?.backupKey);
      let localPKey = String(await getMySecretKey());
      setCloudPrivateKey(cloudPKey);
      setLocalPrivateKey(localPKey);

      await backupKeyHandler();
    } catch (e) {
      setUser(null);
    }
  };

  // Check Key
  const backupKeyHandler = async () => {
    // Local Key is empty.
    if (
      cloudPrivateKey !== null &&
      (localPrivateKey === null ||
        localPrivateKey !== cloudPrivateKey ||
        localPrivateKey === '0')
    ) {
      await saveCloudKeyToLocal();
      return;
    }

    // Generate New Key
    if (
      cloudPrivateKey === null ||
      cloudPrivateKey === undefined ||
      cloudPrivateKey === '0'
    ) {
      await generateNewKey();
    }
    return;
  };

  // Generate new key
  const generateNewKey = async () => {
    console.log('Generating new key');
    // Remove old key
    await removeKey();

    // Generate a new backup key.
    const {publicKey, secretKey} = generateKeyPair();

    //Save Key to local storage.
    await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
    await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());

    // Update a backup key id in User table.
    const originalUser = await DataStore.query(User, String(user?.id));
    await DataStore.save(
      User.copyOf(originalUser, updated => {
        updated.backupKey = String(secretKey);
      }),
    );
  };

  // Load Key from Cloud
  const saveCloudKeyToLocal = async () => {
    console.log('Cloud Key to Local');
    await removeKey();

    await AsyncStorage.setItem(PRIVATE_KEY, String(cloudPrivateKey));
    const newPublicKey = generatePublicKeyFromSecretKey(
      stringToUint8Array(String(cloudPrivateKey)),
    );
    await AsyncStorage.setItem(PUBLIC_KEY, newPublicKey.publicKey.toString());
  };

  // Remove Key in Local Storage.
  const removeKey = async () => {
    // console.log('+++++++++ Removed Local Key ++++++++++');
    await AsyncStorage.removeItem(PRIVATE_KEY);
    await AsyncStorage.removeItem(PUBLIC_KEY);
  };

  const removeCloudKey = async () => {
    console.log('++++++++++ Removing Cloud Key ++++++++++++');
    const originalUser = await DataStore.query(User, String(user?.id));
    await DataStore.save(
      User.copyOf(originalUser, updated => {
        updated.backupKey = null;
      }),
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <FinnerNavigator authUser={user} />

      {user && (
        <>
          <CButton onPress={removeKey} style={{bottom: 30}}>
            Remove Local Key
          </CButton>

          <CButton onPress={removeCloudKey} style={{bottom: 25}}>
            Remove Cloud Key
          </CButton>
        </>
      )}
    </>
  );
};

export default App;

import {Appearance, StatusBar, View} from 'react-native';
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
import {User} from './src/models';
import CButton from './components/UI/CButton';

Amplify.configure(awsconfig);

setPRNG(PRNG);

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [cloudPrivateKey, setCloudPrivateKey] = useState<string | null>();
  // const [localPrivateKey, setLocalPrivateKey] = useState<string | null>();

  // const dispatch = useAppDispatch();
  // // const dataLoaded = useAppSelector(store => store);

  // useEffect(() => {
  //   dispatch(fetchExpensesData());
  // }, []);

  // Listening for Login events.
  useEffect(() => {
    const listener = data => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut') {
        checkUser();
        generateNewKey();
      }
    };
    Hub.listen('auth', listener);

    return () => Hub.remove('auth', listener);
  }, []);

  // Check if authenticated user.
  useEffect(() => {
    checkUser();
  }, []);

  // Check if authenticated user.
  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      // const authUser = await Auth.currentAuthenticatedUser();
      const dbUser = await DataStore.query(User, authUser.attributes.sub);
      setCurrentUser(dbUser);

      const cloudPKey = String(dbUser?.backupKey);
      setCloudPrivateKey(cloudPKey);
      // let localPKey = String(await getMySecretKey());
      // setLocalPrivateKey(localPKey);

      // await generateNewKey();
    } catch (e) {
      // setCurrentUser(null);
    }
  };

  // Generate new key
  const generateNewKey = async () => {
    if (cloudPrivateKey !== null || cloudPrivateKey !== undefined) {
      return;
    }
    console.log('Generating new key');
    // Remove old key
    await AsyncStorage.removeItem(PRIVATE_KEY);
    await AsyncStorage.removeItem(PUBLIC_KEY);

    // Generate a new backup key.
    const {publicKey, secretKey} = generateKeyPair();

    //Save Key to local storage.
    await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
    await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());

    // const originalUser = await DataStore.query(User, user?.id);
    console.log('secretKey: ', secretKey);
    console.log('cloud Key: ', cloudPrivateKey);
    await DataStore.save(
      User.copyOf(currentUser, updated => {
        updated.backupKey = String(secretKey);
      }),
    );
  };

  // Load Key from Cloud
  const saveCloudKeyToLocal = async () => {
    console.log('Cloud Key to Local');
    await AsyncStorage.removeItem(PRIVATE_KEY);
    await AsyncStorage.removeItem(PUBLIC_KEY);

    await AsyncStorage.setItem(PRIVATE_KEY, String(cloudPrivateKey));
    const newPublicKey = generatePublicKeyFromSecretKey(
      stringToUint8Array(String(cloudPrivateKey)),
    );
    await AsyncStorage.setItem(PUBLIC_KEY, newPublicKey.publicKey.toString());
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
      <FinnerNavigator authUser={currentUser} />

      {/* {currentUser && (
        <>
          <CButton onPress={removeCloudKey} style={{bottom: 25}}>
            Remove Cloud Key
          </CButton>
        </>
      )} */}
    </>
  );
};

export default App;

import {LogBox, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {setPRNG} from 'tweetnacl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Amplify, Auth, DataStore, Hub} from 'aws-amplify';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

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
import {useAppDispatch, useAppSelector} from './hooks';
import {fetchExpensesData} from './store/expense-action';
import {fetchIncomesData} from './store/income-action';
import {fetchAccountsData} from './store/account-action';
import {fetchCashAccountsData} from './store/cash-action';
// import {categories} from './dummy/categoryItems';
import {fetchExpenseCategoriesData} from './store/expense-category-action';
import {fetchIncomeCategoriesData} from './store/income-category-action';
import {fetchTransferCategoriesData} from './store/transfer-category-action';
import {fetchDailyTransactsData} from './store/dailyTransact-action';
import awsconfig from './src/aws-exports';

Amplify.configure(awsconfig);

setPRNG(PRNG);

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3212728042764573~3355076099';

const App = () => {
  // Disable warnings for release app.
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message:
  LogBox.ignoreAllLogs(); // Ignore all log notifications:

  const [currentUser, setCurrentUser] = useState<User | null>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>();
  const [cloudPrivateKey, setCloudPrivateKey] = useState<string | null>();
  // const [localPrivateKey, setLocalPrivateKey] = useState<string | null>();

  // Listening for Login events.
  useEffect(() => {
    const listener = data => {
      if (data.payload.event === 'signIn') {
        checkUser();
        generateNewKey();
        // setIsAuthenticated(true);
      }
      if (data.payload.event === 'signOut') {
        checkUser();
        setIsAuthenticated(false);
      }
    };

    Hub.listen('auth', listener);
  }, []);

  // Check if authenticated user.
  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const authedUser = await Auth.currentAuthenticatedUser();
        setIsAuthenticated(true);
      } catch (err) {}
    };
    isAuthenticated();
  }, []);

  // Check if authenticated user.
  const checkUser = async () => {
    try {
      // const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      const authUser = await Auth.currentAuthenticatedUser();
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
    // Remove old key
    await AsyncStorage.removeItem(PRIVATE_KEY);
    await AsyncStorage.removeItem(PUBLIC_KEY);

    // Generate a new backup key.
    const {publicKey, secretKey} = generateKeyPair();

    //Save Key to local storage.
    await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
    await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());

    // const originalUser = await DataStore.query(User, user?.id);
    await DataStore.save(
      User.copyOf(currentUser, updated => {
        updated.backupKey = String(secretKey);
      }),
    );
  };

  // Load Key from Cloud
  // const saveCloudKeyToLocal = async () => {
  //   await AsyncStorage.removeItem(PRIVATE_KEY);
  //   await AsyncStorage.removeItem(PUBLIC_KEY);

  //   await AsyncStorage.setItem(PRIVATE_KEY, String(cloudPrivateKey));
  //   const newPublicKey = generatePublicKeyFromSecretKey(
  //     stringToUint8Array(String(cloudPrivateKey)),
  //   );
  //   await AsyncStorage.setItem(PUBLIC_KEY, newPublicKey.publicKey.toString());
  // };

  // const removeCloudKey = async () => {
  //   const originalUser = await DataStore.query(User, String(user?.id));
  //   await DataStore.save(
  //     User.copyOf(originalUser, updated => {
  //       updated.backupKey = null;
  //     }),
  //   );
  // };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <FinnerNavigator isAuthenticated={isAuthenticated} />

      {isAuthenticated && (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          onAdClosed
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      )}

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

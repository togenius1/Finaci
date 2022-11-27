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

Amplify.configure(awsconfig);

setPRNG(PRNG);

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>();
  const [cloudPrivateKey, setCloudPrivateKey] = useState<string | null>();
  // const [localPrivateKey, setLocalPrivateKey] = useState<string | null>();

  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  // useEffect(() => {
  // dispatch(fetchExpensesData());
  // dispatch(fetchIncomesData());
  // dispatch(fetchAccountsData());
  // dispatch(fetchCashAccountsData());
  // dispatch(fetchExpenseCategoriesData());
  // dispatch(fetchIncomeCategoriesData());
  // dispatch(fetchTransferCategoriesData());
  // dispatch(fetchDailyTransactsData());
  // }, []);

  // console.log('App: ', dataLoaded.expenses.expenses);

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
        // console.log(authedUser); // this means that you've logged in before with valid user/pass.
        setIsAuthenticated(true);
      } catch (err) {
        console.log(err); // this means there is no currently authenticated user
      }
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
      <FinnerNavigator isAuthenticated={isAuthenticated} />

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

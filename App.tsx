import {LogBox, Pressable, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {setPRNG} from 'tweetnacl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Amplify, Auth, DataStore, Hub} from 'aws-amplify';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {generateKeyPair, PRIVATE_KEY, PRNG, PUBLIC_KEY} from './util/crypto';
import FinnerNavigator from './navigation/FinnerNavigator';
import {useAppDispatch, useAppSelector} from './hooks';
import {fetchCashAccountsData} from './store/cash-action';
import {fetchAccountsData} from './store/account-action';
import {fetchIncomeCategoriesData} from './store/income-category-action';
import {fetchExpenseCategoriesData} from './store/expense-category-action';
import {fetchExpensesData} from './store/expense-action';
import {fetchIncomesData} from './store/income-action';
import {fetchDailyTransactsData} from './store/dailyTransact-action';
import {fetchMonthlyTransactsData} from './store/monthlyTransact-action';
import {fetchWeeklyTransactsData} from './store/weeklyTransact-action';
import awsconfig from './src/aws-exports';
import {LazyUser, User} from './src/models';

Amplify.configure(awsconfig);

setPRNG(PRNG);

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3212728042764573~3355076099';

const App = () => {
  // Disable warnings for release app.
  // LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message:
  // LogBox.ignoreAllLogs(); // Ignore all log notifications:

  const dispatch = useAppDispatch();
  const expenseCateData = useAppSelector(
    state => state.expenseCategories.expenseCategories,
    // shallowEqual,
  );
  const incomesCateData = useAppSelector(
    state => state.incomeCategories.incomeCategories,
    // shallowEqual,
  );
  const cashData = useAppSelector(
    state => state.cashAccounts.cashAccounts,
    // shallowEqual,
  );
  const accountsData = useAppSelector(
    state => state.accounts.accounts,
    // shallowEqual,
  );

  const [currentUser, setCurrentUser] = useState<LazyUser[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [cloudPrivateKey, setCloudPrivateKey] = useState<string | null>('');
  const [closedAds, setClosedAds] = useState<boolean>(false);
  // const [localPrivateKey, setLocalPrivateKey] = useState<string | null>();

  //Reset Expense
  // useEffect(() => {
  //   dispatch(fetchCashAccountsData());
  //   dispatch(fetchExpensesData());
  //   dispatch(fetchIncomesData());
  //   dispatch(fetchMonthlyTransactsData());
  //   dispatch(fetchWeeklyTransactsData());
  //   dispatch(fetchDailyTransactsData());
  // }, []);

  // Load Existing Category
  // useEffect(() => {

  // }, []);

  // Listening for Login events.
  useEffect(() => {
    const listener = async data => {
      if (data.payload.event === 'signIn') {
        // Load Existing Category
        if (expenseCateData.length === 0) {
          dispatch(fetchExpenseCategoriesData());
        }
        if (incomesCateData.length === 0) {
          dispatch(fetchIncomeCategoriesData());
        }
        if (cashData.length === 0) {
          dispatch(fetchCashAccountsData());
        }
        if (accountsData.length === 0) {
          dispatch(fetchAccountsData());
        }

        // Check and generate a new key
        await checkUserAndGenerateNewKey();
        // generateNewKey();
        setIsAuthenticated(true);
      }
      if (data.payload.event === 'signOut') {
        checkUserAndGenerateNewKey();
        setIsAuthenticated(false);
      }
    };

    Hub.listen('auth', listener);
  }, []);

  // Check if authenticated user.
  useEffect(() => {
    const isAuthenticated = async () => {
      const authedUser = await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
    };

    isAuthenticated();
  }, []);

  // Check if authenticated user.
  const checkUserAndGenerateNewKey = async () => {
    // const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
    const authUser = await Auth.currentAuthenticatedUser();
    const subId = String(authUser.attributes.sub);
    const dbUser = await DataStore.query(User, c => c.id.eq(subId));
    setCurrentUser(dbUser);

    const cloudPKey = dbUser[0]?.backupKey;
    setCloudPrivateKey(cloudPKey!);

    generateNewKey();
  };

  // Generate new key
  const generateNewKey = async () => {
    // Compare Cloud key with local key
    if (cloudPrivateKey === null) {
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
        User.copyOf(currentUser[0], updated => {
          updated.backupKey = String(secretKey);
        }),
      );
    }
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

  const closeAdsHandler = () => {
    setClosedAds(true);
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <FinnerNavigator isAuthenticated={isAuthenticated} />

      {isAuthenticated && !closedAds && (
        <>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => closeAdsHandler()}>
            <View style={styles.close}>
              <MaterialCommunityIcons name="close" size={20} color={'grey'} />
            </View>
          </Pressable>

          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </>
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

const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    right: 15,
  },
  pressed: {
    opacity: 0.65,
  },
});

// ========================================================
const before = [
  {
    accountId: 'cash-2d44474f-c6a2-43c5-840a-ae12755c745f',
    amount: 100,
    cateId: 'ec1',
    date: '2023-03-30 13:41:00',
    id: 'expense-ab78aafc-9480-4073-a23b-7b163bf5206f',
    note: '',
  },
  {
    accountId: 'cash-2d44474f-c6a2-43c5-840a-ae12755c745f',
    amount: 300,
    cateId: 'ec2',
    date: '2023-03-29 13:41:00',
    id: 'expense-cdd92bd0-6ee4-47b8-8a81-b9d42922a3a2',
    note: '',
  },
];

// ========================================================
const after = {
  accountId: 'cash-42a26043-5996-4181-a227-1fd676c6bf8e',
  amount: 100,
  cateId: 'ec1',
  date: '2023-03-30 13:21:09',
  id: 'expense-7891be44-3e8c-4841-9989-25008542d2ce',
  note: '',
  week: 5,
};

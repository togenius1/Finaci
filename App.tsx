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

const obj = [
  [
    {
      amount: 1000,
      cateId: 'ic3',
      date: '2023-01-01 14:46:00',
      day: 1,
      id: 'income-062a0a89-7da0-4f38-82e9-a2cc165f5341',
      note: '',
    },
    {
      amount: 2000,
      cateId: 'ic2',
      date: '2023-02-02 14:46:00',
      day: 2,
      id: 'income-e2d35b9e-675c-4330-840d-30e90c8359a0',
      note: '',
    },
    {
      accountId: 'cash-991871c1-0861-4507-8c56-6edb4e4287ef',
      amount: 2000,
      cateId: 'ic2',
      date: '2023-03-23 15:05:00',
      day: 23,
      id: 'income-7242b0ad-8451-4f56-a02d-864f0764bbd1',
      note: '',
    },
    {
      accountId: 'cash-991871c1-0861-4507-8c56-6edb4e4287ef',
      amount: 1200,
      cateId: 'ic3',
      date: '2023-01-08 10:57:00',
      day: 8,
      id: 'income-48e3c015-afef-4e1a-8247-af26e75c7f7f',
      note: '',
    },
  ],
  [
    {
      amount: 100,
      cateId: 'ec1',
      date: '2023-01-01 14:46:00',
      day: 1,
      id: 'expense-0b5637d5-7068-4bc5-8eb4-21561b9961c4',
      note: '',
    },
    {
      amount: 200,
      cateId: 'ec1',
      date: '2023-02-02 14:46:00',
      day: 2,
      id: 'expense-26e98f00-75f4-4865-9e47-cfde4ea498e8',
      note: '',
    },
    {
      accountId: 'cash-991871c1-0861-4507-8c56-6edb4e4287ef',
      amount: 200,
      cateId: 'ec1',
      date: '2023-03-23 15:05:00',
      day: 23,
      id: 'expense-49f4a43e-6081-40fa-bed8-1e441bd903d2',
      note: '',
    },
    {
      accountId: 'cash-991871c1-0861-4507-8c56-6edb4e4287ef',
      amount: 120,
      cateId: 'ec1',
      date: '2023-01-08 10:57:00',
      day: 8,
      id: 'expense-42b19cd2-78b6-41a0-9ac2-0c2ab2e33210',
      note: '',
    },
    {
      accountId: 'cash-991871c1-0861-4507-8c56-6edb4e4287ef',
      amount: 300,
      cateId: 'ec1',
      date: '2023-01-01 14:23:00',
      day: 1,
      id: 'expense-19af497a-f929-4ef7-85ce-d42d82803d80',
      note: '',
    },
  ],
];

// expense
const group = {
  '2022-1': [
    {
      amount: 20023,
      cateId: 'ic4',
      date: '2022-01-01 14:23:00',
      day: 1,
      id: 'income-40092052-099e-420a-872a-bb06e624891c',
      note: '',
    },
    {
      amount: 2022,
      cateId: 'ec2',
      date: '2022-01-01 14:23:00',
      day: 1,
      id: 'expense-88b250bc-df6b-4a42-9f16-9cc64138b785',
      note: '',
    },
  ],
  '2023-1': [
    {
      amount: 1000,
      cateId: 'ic3',
      date: '2023-01-01 14:46:00',
      day: 1,
      id: 'income-062a0a89-7da0-4f38-82e9-a2cc165f5341',
      note: '',
    },
    {
      amount: 400,
      cateId: 'ec1',
      date: '2023-01-01 14:46:00',
      day: 1,
      id: 'expense-0b5637d5-7068-4bc5-8eb4-21561b9961c4',
      note: '',
    },
  ],
  '2023-33': [
    {
      amount: 2000,
      cateId: 'ic2',
      date: '2023-02-02 14:46:00',
      day: 2,
      id: 'income-e2d35b9e-675c-4330-840d-30e90c8359a0',
      note: '',
    },
    {
      amount: 200,
      cateId: 'ec1',
      date: '2023-02-02 14:46:00',
      day: 2,
      id: 'expense-26e98f00-75f4-4865-9e47-cfde4ea498e8',
      note: '',
    },
  ],
  '2023-8': [
    {
      accountId: 'cash-991871c1-0861-4507-8c56-6edb4e4287ef',
      amount: 1200,
      cateId: 'ic3',
      date: '2023-01-08 10:57:00',
      day: 8,
      id: 'income-48e3c015-afef-4e1a-8247-af26e75c7f7f',
      note: '',
    },
    {
      accountId: 'cash-991871c1-0861-4507-8c56-6edb4e4287ef',
      amount: 120,
      cateId: 'ec1',
      date: '2023-01-08 10:57:00',
      day: 8,
      id: 'expense-42b19cd2-78b6-41a0-9ac2-0c2ab2e33210',
      note: '',
    },
  ],
  '2023-82': [
    {
      accountId: 'cash-991871c1-0861-4507-8c56-6edb4e4287ef',
      amount: 2000,
      cateId: 'ic2',
      date: '2023-03-23 15:05:00',
      day: 23,
      id: 'income-7242b0ad-8451-4f56-a02d-864f0764bbd1',
      note: '',
    },
    {
      accountId: 'cash-991871c1-0861-4507-8c56-6edb4e4287ef',
      amount: 200,
      cateId: 'ec1',
      date: '2023-03-23 15:05:00',
      day: 23,
      id: 'expense-49f4a43e-6081-40fa-bed8-1e441bd903d2',
      note: '',
    },
  ],
};

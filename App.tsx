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
      amount: 2000,
      cateId: 'ic3',
      date: '2023-02-01 13:23:00',
      id: 'income-8a6dd677-cde5-4c63-869a-d7cdfcb92872',
      month: 1,
      note: '',
    },
    {
      amount: 2000,
      cateId: 'ic4',
      date: '2023-02-26 14:36:00',
      id: 'income-4bfc4f8d-51ca-4358-ae72-203462735187',
      month: 1,
      note: '',
    },
    {
      amount: 2000,
      cateId: 'ic3',
      date: '2023-02-02 13:23:00',
      id: 'income-38ef6473-6ab5-44da-894a-1fff38d3ff4b',
      month: 1,
      note: '',
    },
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 3000,
      cateId: 'ic4',
      date: '2023-03-21 13:32:10',
      id: 'income-db3278e3-b7bb-4354-b1b7-2154da1e4167',
      month: 2,
      note: '',
    },
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 3000,
      cateId: 'ic5',
      date: '2023-03-21 13:32:46',
      id: 'income-d806f09f-9296-4108-8ff0-61ae9f9e7c3c',
      month: 2,
      note: '',
    },
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 3000,
      cateId: 'ic3',
      date: '2023-03-22 14:38:01',
      id: 'income-bc42569d-17de-4a00-91e5-739d8cf93269',
      month: 2,
      note: '',
    },
  ],
  [
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 200,
      cateId: 'ec1',
      date: '2023-02-01 13:23:00',
      id: 'expense-a8d1b2a6-a6cc-4821-aec9-fd00bf91717b',
      month: 1,
      note: '',
    },
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 200,
      cateId: 'ec2',
      date: '2023-02-02 13:23:00',
      id: 'expense-c76ed3b4-f902-4c84-b1e3-9ed2c423ec06',
      month: 1,
      note: '',
    },
    {
      amount: 200,
      cateId: 'ec1',
      date: '2023-02-26 14:36:00',
      id: 'expense-58aec2dd-53e0-414e-8f20-2a840ae2acca',
      month: 1,
      note: '',
    },
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 300,
      cateId: 'ec1',
      date: '2023-03-21 13:31:55',
      id: 'expense-95da8a83-af30-4a8c-bf2b-14e3785c657b',
      month: 2,
      note: '',
    },
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 300,
      cateId: 'ec1',
      date: '2023-03-21 13:23:00',
      id: 'expense-36d10214-8a8b-4c75-815a-f18553a23f40',
      month: 2,
      note: '',
    },
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 300,
      cateId: 'ec2',
      date: '2023-03-22 14:38:35',
      id: 'expense-49a491d1-b65f-4bb1-b4ef-33181c4d3870',
      month: 2,
      note: '',
    },
  ],
];

// Sum
const sum = [
  {
    amount: 6000,
    cateId: 'ic3',
    date: '2023-02-01 13:23:00',
    id: 'income-8a6dd677-cde5-4c63-869a-d7cdfcb92872',
    month: 1,
    note: '',
  },
  {
    accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
    amount: 600,
    cateId: 'ec1',
    date: '2023-02-01 13:23:00',
    id: 'expense-a8d1b2a6-a6cc-4821-aec9-fd00bf91717b',
    month: 1,
    note: '',
  },
  {
    accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
    amount: 9000,
    cateId: 'ic4',
    date: '2023-03-21 13:32:10',
    id: 'income-db3278e3-b7bb-4354-b1b7-2154da1e4167',
    month: 2,
    note: '',
  },
  {
    accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
    amount: 900,
    cateId: 'ec1',
    date: '2023-03-21 13:31:55',
    id: 'expense-95da8a83-af30-4a8c-bf2b-14e3785c657b',
    month: 2,
    note: '',
  },
];

// Result
const groupByMonth = {
  '1': [
    {
      amount: 6000,
      cateId: 'ic3',
      date: '2023-02-01 13:23:00',
      id: 'income-8a6dd677-cde5-4c63-869a-d7cdfcb92872',
      month: 1,
      note: '',
    },
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 600,
      cateId: 'ec1',
      date: '2023-02-01 13:23:00',
      id: 'expense-a8d1b2a6-a6cc-4821-aec9-fd00bf91717b',
      month: 1,
      note: '',
    },
  ],
  '2': [
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 9000,
      cateId: 'ic4',
      date: '2023-03-21 13:32:10',
      id: 'income-db3278e3-b7bb-4354-b1b7-2154da1e4167',
      month: 2,
      note: '',
    },
    {
      accountId: 'cash-ca069d57-a398-46fb-ab68-68a713449d4d',
      amount: 900,
      cateId: 'ec1',
      date: '2023-03-21 13:31:55',
      id: 'expense-95da8a83-af30-4a8c-bf2b-14e3785c657b',
      month: 2,
      note: '',
    },
  ],
};

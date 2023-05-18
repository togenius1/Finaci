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
  {expense_weekly: 0, id: 'transId1', income_weekly: 0, week: 0, weekInYear: 1},
  {expense_weekly: 0, id: 'transId2', income_weekly: 0, week: 0, weekInYear: 2},
  {expense_weekly: 0, id: 'transId3', income_weekly: 0, week: 0, weekInYear: 3},
  {expense_weekly: 0, id: 'transId4', income_weekly: 0, week: 0, weekInYear: 4},
  {expense_weekly: 0, id: 'transId5', income_weekly: 0, week: 0, weekInYear: 5},
  {expense_weekly: 0, id: 'transId6', income_weekly: 0, week: 0, weekInYear: 6},
  {expense_weekly: 0, id: 'transId7', income_weekly: 0, week: 0, weekInYear: 7},
  {expense_weekly: 0, id: 'transId8', income_weekly: 0, week: 0, weekInYear: 8},
  {expense_weekly: 0, id: 'transId9', income_weekly: 0, week: 0, weekInYear: 9},
  {
    expense_weekly: 0,
    id: 'transId10',
    income_weekly: 0,
    week: 0,
    weekInYear: 10,
  },
  {
    expense_weekly: 0,
    id: 'transId11',
    income_weekly: 0,
    week: 0,
    weekInYear: 11,
  },
  {
    expense_weekly: 0,
    id: 'transId12',
    income_weekly: 0,
    week: 0,
    weekInYear: 12,
  },
  {
    expense_weekly: 0,
    id: 'transId13',
    income_weekly: 0,
    week: 0,
    weekInYear: 13,
  },
  {
    expense_weekly: 0,
    id: 'transId14',
    income_weekly: 0,
    week: 0,
    weekInYear: 14,
  },
  {
    expense_weekly: 0,
    id: 'transId15',
    income_weekly: 0,
    week: 0,
    weekInYear: 15,
  },
  {
    expense_weekly: 0,
    id: 'transId16',
    income_weekly: 0,
    week: 0,
    weekInYear: 16,
  },
  {
    expense_weekly: 0,
    id: 'transId17',
    income_weekly: 0,
    week: 0,
    weekInYear: 17,
  },
  {
    expense_weekly: 0,
    id: 'transId18',
    income_weekly: 0,
    week: 0,
    weekInYear: 18,
  },
  {
    expense_weekly: 0,
    id: 'transId19',
    income_weekly: 0,
    week: 0,
    weekInYear: 19,
  },
  {
    date: '2023-05-18 13:16:06',
    expense_weekly: 0,
    id: 'transId20',
    income_weekly: 300,
    week: 4,
  },
  {
    expense_weekly: 0,
    id: 'transId21',
    income_weekly: 0,
    week: 0,
    weekInYear: 21,
  },
  {
    expense_weekly: 0,
    id: 'transId22',
    income_weekly: 0,
    week: 0,
    weekInYear: 22,
  },
  {
    expense_weekly: 0,
    id: 'transId23',
    income_weekly: 0,
    week: 0,
    weekInYear: 23,
  },
  {
    expense_weekly: 0,
    id: 'transId24',
    income_weekly: 0,
    week: 0,
    weekInYear: 24,
  },
  {
    expense_weekly: 0,
    id: 'transId25',
    income_weekly: 0,
    week: 0,
    weekInYear: 25,
  },
  {
    expense_weekly: 0,
    id: 'transId26',
    income_weekly: 0,
    week: 0,
    weekInYear: 26,
  },
  {
    expense_weekly: 0,
    id: 'transId27',
    income_weekly: 0,
    week: 0,
    weekInYear: 27,
  },
  {
    expense_weekly: 0,
    id: 'transId28',
    income_weekly: 0,
    week: 0,
    weekInYear: 28,
  },
  {
    expense_weekly: 0,
    id: 'transId29',
    income_weekly: 0,
    week: 0,
    weekInYear: 29,
  },
  {
    expense_weekly: 0,
    id: 'transId30',
    income_weekly: 0,
    week: 0,
    weekInYear: 30,
  },
  {
    expense_weekly: 0,
    id: 'transId31',
    income_weekly: 0,
    week: 0,
    weekInYear: 31,
  },
  {
    expense_weekly: 0,
    id: 'transId32',
    income_weekly: 0,
    week: 0,
    weekInYear: 32,
  },
  {
    expense_weekly: 0,
    id: 'transId33',
    income_weekly: 0,
    week: 0,
    weekInYear: 33,
  },
  {
    expense_weekly: 0,
    id: 'transId34',
    income_weekly: 0,
    week: 0,
    weekInYear: 34,
  },
  {
    expense_weekly: 0,
    id: 'transId35',
    income_weekly: 0,
    week: 0,
    weekInYear: 35,
  },
  {
    expense_weekly: 0,
    id: 'transId36',
    income_weekly: 0,
    week: 0,
    weekInYear: 36,
  },
  {
    expense_weekly: 0,
    id: 'transId37',
    income_weekly: 0,
    week: 0,
    weekInYear: 37,
  },
  {
    expense_weekly: 0,
    id: 'transId38',
    income_weekly: 0,
    week: 0,
    weekInYear: 38,
  },
  {
    expense_weekly: 0,
    id: 'transId39',
    income_weekly: 0,
    week: 0,
    weekInYear: 39,
  },
  {
    expense_weekly: 0,
    id: 'transId40',
    income_weekly: 0,
    week: 0,
    weekInYear: 40,
  },
  {
    expense_weekly: 0,
    id: 'transId41',
    income_weekly: 0,
    week: 0,
    weekInYear: 41,
  },
  {
    expense_weekly: 0,
    id: 'transId42',
    income_weekly: 0,
    week: 0,
    weekInYear: 42,
  },
  {
    expense_weekly: 0,
    id: 'transId43',
    income_weekly: 0,
    week: 0,
    weekInYear: 43,
  },
  {
    expense_weekly: 0,
    id: 'transId44',
    income_weekly: 0,
    week: 0,
    weekInYear: 44,
  },
  {
    expense_weekly: 0,
    id: 'transId45',
    income_weekly: 0,
    week: 0,
    weekInYear: 45,
  },
  {
    expense_weekly: 0,
    id: 'transId46',
    income_weekly: 0,
    week: 0,
    weekInYear: 46,
  },
  {
    expense_weekly: 0,
    id: 'transId47',
    income_weekly: 0,
    week: 0,
    weekInYear: 47,
  },
  {
    expense_weekly: 0,
    id: 'transId48',
    income_weekly: 0,
    week: 0,
    weekInYear: 48,
  },
  {
    expense_weekly: 0,
    id: 'transId49',
    income_weekly: 0,
    week: 0,
    weekInYear: 49,
  },
  {
    expense_weekly: 0,
    id: 'transId50',
    income_weekly: 0,
    week: 0,
    weekInYear: 50,
  },
  {
    expense_weekly: 0,
    id: 'transId51',
    income_weekly: 0,
    week: 0,
    weekInYear: 51,
  },
  {
    expense_weekly: 0,
    id: 'transId52',
    income_weekly: 0,
    week: 0,
    weekInYear: 52,
  },
];

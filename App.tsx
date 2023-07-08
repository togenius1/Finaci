import {
  ActivityIndicator,
  Appearance,
  LogBox,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  // useColorScheme,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {setPRNG} from 'tweetnacl';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {Amplify, Auth, DataStore, Hub} from 'aws-amplify';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';

import {generateKeyPair, PRNG} from './util/crypto';
import FinnerNavigator from './navigation/FinnerNavigator';
import {useAppDispatch, useAppSelector} from './hooks';
import {fetchCashAccountsData} from './store/cash-action';
import {fetchAccountsData} from './store/account-action';
import {fetchIncomeCategoriesData} from './store/income-category-action';
import {fetchExpenseCategoriesData} from './store/expense-category-action';
// import {fetchExpensesData} from './store/expense-action';
// import {fetchIncomesData} from './store/income-action';
// import {fetchDailyTransactsData} from './store/dailyTransact-action';
// import {fetchMonthlyTransactsData} from './store/monthlyTransact-action';
// import {fetchWeeklyTransactsData} from './store/weeklyTransact-action';
import awsconfig from './src/aws-exports';
import {LazyUser, User} from './src/models';
import {authAccountsActions} from './store/authAccount-slice';
import moment from 'moment';
import {API_KEY, ENTITLEMENT_PRO, ENTITLEMENT_STD} from './constants/api';
import {useNavigation} from '@react-navigation/native';
import customerInfoSlice, {
  customerInfoActions,
} from './store/customerInfo-slice';
import {fetchCustomerInfoData} from './store/customerInfo-action';

Amplify.configure(awsconfig);

setPRNG(PRNG);

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3212728042764573~3355076099';

const App = () => {
  // Disable warnings for release app.
  // LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message:
  // LogBox.ignoreAllLogs(); // Ignore all log notifications:
  // add

  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const authAccounts = dataLoaded?.authAccounts?.authAccounts;

  const customerInfosData = dataLoaded?.customerInfos?.customerInfos;

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

  // const [currentUser, setCurrentUser] = useState<LazyUser[]>([]);
  const [appUserId, setAppUserId] = useState<string | null>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  // const [cloudPrivateKey, setCloudPrivateKey] = useState<string | null>('');
  const [closedAds, setClosedAds] = useState<boolean>(false);
  // const [localPrivateKey, setLocalPrivateKey] = useState<string | null>();
  const [showIndicator, setShowIndicator] = useState<boolean>(false);

  // Check if authenticated user, Stay logged in.
  useEffect(() => {
    const isAuthenticated = async () => {
      // const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      const authUser = await Auth.currentAuthenticatedUser();

      setIsAuthenticated(true);
    };

    isAuthenticated();
  }, []);

  // Listening for Login events.
  useEffect(() => {
    const listenerAuth = async data => {
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

        checkUserAndGenerateNewKey();
        await configPurchase();
        await getUserData();
        onCloseBannerAds();

        setIsAuthenticated(true);
      }
      if (data.payload.event === 'signOut') {
        setIsAuthenticated(false);
        await getUserData();
      }
    };

    Hub.listen('auth', listenerAuth);
  }, []);

  // Purchase Listener
  useEffect(() => {
    Purchases.addCustomerInfoUpdateListener(getUserData);

    return () => {
      Purchases.removeCustomerInfoUpdateListener;
    };
  }, []);

  // Generate backup key
  // useEffect(() => {
  //   checkUserAndGenerateNewKey();
  // }, []);

  // Close Ads
  useEffect(() => {
    onCloseBannerAds();
  }, []);

  // Load Purchases
  const configPurchase = async () => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    const authUser = await Auth.currentAuthenticatedUser();

    if (Platform.OS === 'ios') {
      Purchases.configure({apiKey: ''});
    } else if (Platform.OS === 'android') {
      // Purchases.configure({apiKey: API_KEY});
      Purchases.configure({
        apiKey: API_KEY,
        appUserID: authUser?.attributes?.sub,
      });

      // OR: if building for Amazon, be sure to follow the installation instructions then:
      //  Purchases.configure({ apiKey: <public_amazon_sdk_key>, useAmazon: true });
    }
  };

  // Get User Data
  const getUserData = async () => {
    // Delete data in Storage
    // fetchCustomerInfoData();
    const customerInfo = await Purchases.getCustomerInfo();
    const appUserId = await Purchases.getAppUserID();
    const stdActive =
      typeof customerInfo?.entitlements?.active[ENTITLEMENT_STD] !==
      'undefined';
    const proActive =
      typeof customerInfo?.entitlements?.active[ENTITLEMENT_PRO] !==
      'undefined';

    const customerInfoInStorage = customerInfosData?.filter(
      cus => cus.appUserId === appUserId,
    );

    if (customerInfoInStorage?.length === 0) {
      dispatch(
        customerInfoActions.addCustomerInfo({
          id: 'accountInfo-' + appUserId,
          appUserId: appUserId,
          stdActive: stdActive,
          proActive: proActive,
          date: moment(),
        }),
      );
    } else {
      dispatch(
        customerInfoActions.updateCustomerInfo({
          id: customerInfoInStorage[0]?.id,
          appUserId: appUserId,
          stdActive: stdActive,
          proActive: proActive,
          date: moment(),
        }),
      );
    }
  };

  // Load Packages and set close ads
  // useEffect(() => {
  //   // Close Ads
  const onCloseBannerAds = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    const appUserId = authUser?.attributes?.sub;
    const filteredCustomerInfo = customerInfosData?.filter(
      cus => cus.appUserId === appUserId,
    );

    if (
      filteredCustomerInfo[0]?.stdActive ||
      filteredCustomerInfo[0]?.proActive
    ) {
      setClosedAds(true);
    } else {
      setClosedAds(false);
    }
  };

  // Check if authenticated user.
  const checkUserAndGenerateNewKey = async () => {
    // const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
    const authedUser = await Auth.currentAuthenticatedUser();
    const subId: string = authedUser?.attributes?.sub;
    // const dbCurrentUser = await DataStore.query(User, c => c.id.eq(subId));

    const sub = DataStore.observeQuery(User, c => c.id.eq(subId)).subscribe(
      ({items}) => {
        const dbCurrentUser = items;
        const name = String(items[0]?.name);
        const cloudPKey = String(items[0]?.backupKey);

        const key: string = cloudPKey === 'undefined' ? 'null' : cloudPKey;

        generateNewKey(subId, name, key, dbCurrentUser);
      },
    );
  };

  // Generate new key
  const generateNewKey = async (
    id: string,
    name: string,
    pKey: string,
    dbUser: LazyUser[],
  ) => {
    setShowIndicator(true);

    // Compare Cloud key with local key
    if (pKey === 'null') {
      // Generate a new backup key.
      const {publicKey, secretKey} = generateKeyPair();

      // Save the new key to the cloud
      const updatedPrivateKey = await DataStore.save(
        User.copyOf(dbUser[0], updated => {
          updated.backupKey = String(secretKey);
        }),
      );

      // const updatedPublicKey = await DataStore.save(
      //   User.copyOf(dbUser[0], updated => {
      //     updated.publicKey = String(publicKey);
      //   }),
      // );

      // Check if this account isEmpty
      const existingAccount = authAccounts?.filter(
        account => account?.id === id,
      );

      if (existingAccount?.length === 0) {
        dispatch(
          authAccountsActions.addAuthAccount({
            id: id,
            name: name,
            backupKey: secretKey.toString(),
            publicKey: publicKey.toString(),
            keyCreatedDate: moment(),
          }),
        );
      }
    }
    setShowIndicator(false);
  };

  const closeAdsHandler = () => {
    setClosedAds(true);
  };

  // Color scheme
  const colorScheme = Appearance.getColorScheme();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ActivityIndicator
        size="large"
        color="#0000ff"
        animating={showIndicator}
      />
      <FinnerNavigator
        isAuthenticated={isAuthenticated}
        colorScheme={colorScheme}
      />

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
    </>
  );
};

export default App;

//========== Style sheet =======================================
const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    right: 15,
  },
  pressed: {
    opacity: 0.65,
  },
});

// =================================

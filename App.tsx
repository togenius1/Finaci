import {
  ActivityIndicator,
  Alert,
  Linking,
  LogBox,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  // DevSettings,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {setPRNG} from 'tweetnacl';
import {Amplify, Auth, DataStore, Hub} from 'aws-amplify';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';

import {generateKeyPair, PRNG} from './util/crypto';
import FinnerNavigator from './navigation/FinnerNavigator';
import {useAppDispatch, useAppSelector} from './hooks';
import {fetchCashAccountsData} from './store/cash-action';
import {fetchAccountsData} from './store/account-action';
import {fetchIncomeCategoriesData} from './store/income-category-action';
import {fetchExpenseCategoriesData} from './store/expense-category-action';
import awsconfig from './src/aws-exports';
import {User} from './src/models';
import {authAccountsActions} from './store/authAccount-slice';
import moment from 'moment';
import {API_KEY, ENTITLEMENT_PRO, ENTITLEMENT_STD} from './constants/api';
import {customerInfoActions} from './store/customerInfo-slice';
import TransactProvider from './store-context/TransactProvider';
import OverviewProvider from './store-context/OverviewProvider';

Amplify.configure(awsconfig);

setPRNG(PRNG);

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3212728042764573~3355076099';

const App = () => {
  // // Disable warnings for release app.
  // LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message:
  // LogBox.ignoreAllLogs(); // Ignore all log notifications: add

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
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  // const [cloudPrivateKey, setCloudPrivateKey] = useState<string | null>('');
  const [closedAds, setClosedAds] = useState<boolean>(false);
  // const [localPrivateKey, setLocalPrivateKey] = useState<string | null>();
  const [showIndicator, setShowIndicator] = useState<boolean>(false);

  const [latestVersion, setLatestVersion] = useState(null);

  useEffect(() => {
    // Fetch the latest version from the Google Play Store
    VersionCheck.getLatestVersion()
      .then(version => {
        setLatestVersion(version);
      })
      .catch(error => {
        console.log('Error fetching latest version:', error);
      });
  }, []);

  const currentVersion = DeviceInfo.getVersion();

  useEffect(() => {
    // Compare the current version with the latest version
    if (latestVersion && currentVersion !== latestVersion) {
      // Show a notification to update the app
      Alert.alert(
        'Update Available',
        'A new version of the app is available. Please update to the latest version for the best experience.',
        [
          {
            text: 'Update Now',
            onPress: () => {
              // Redirect the user to the Google Play Store
              VersionCheck.getStoreUrl().then(url => {
                // Open the store URL to the app's page in the Play Store
                handleSignOut(url);
              });
            },
          },
          {text: 'Later', style: 'cancel'},
        ],
        {cancelable: false},
      );
    }
  }, [latestVersion, currentVersion]);

  // // Check if authenticated user, Stay logged in.
  // useEffect(() => {
  //   const isAuthenticated = async () => {
  //     // const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
  //     const authUser = await Auth.currentAuthenticatedUser();

  //     // setIsAuthenticated(true);
  //   };

  //   isAuthenticated();
  // }, []);

  // Fetch category
  useEffect(() => {
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
  }, []);

  // Listening for Login events.
  useEffect(() => {
    const listenerAuth = async data => {
      if (data.payload.event === 'signIn') {
        // DevSettings.reload();

        await checkUserAndGenerateNewKey();
        await configPurchase();
        await getUserData();
        onCloseBannerAds();

        // setIsAuthenticated(true);
      }
      if (data.payload.event === 'signOut') {
        // setIsAuthenticated(false);
        await getUserData();
      }
    };

    Hub.listen('auth', listenerAuth);
  }, []);

  // Configure purchase
  useEffect(() => {
    const config = async () => {
      await configPurchase();
    };
    config();
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

  // Update the latest version
  const handleSignOut = async (url: string) => {
    try {
      await Auth.signOut(); // Sign out the user
      Linking.openURL(url);
      // Additional cleanup or navigation logic can be performed here
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

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
        // const dbCurrentUser = items;
        const name = items[0]?.name;
        const cloudPKey = String(items[0]?.backupKey);
        const pubKey = String(items[0]?.publicKey);

        const backupKey: string =
          cloudPKey === 'undefined' ? 'null' : cloudPKey;

        if (backupKey === 'null') {
          generateNewKey(subId, name);
        } else {
          pKeyCloudToLocalStorage(subId, name, backupKey, pubKey);
        }
      },
    );
  };

  // Generate new key for new account
  const generateNewKey = async (id: string, name: string) => {
    setShowIndicator(true);

    const {publicKey, secretKey} = generateKeyPair();

    // Update back key to cloud
    updateUserItem(id, {
      backupKey: String(secretKey),
      publicKey: String(publicKey),
    });

    // Push new User data to local storage
    pKeyCloudToLocalStorage(id, name, String(secretKey), String(publicKey));

    setShowIndicator(false);
  };

  // To update an existing item in the DataStore,
  async function updateUserItem(
    itemId: string,
    updatedProperties: Partial<User>,
  ) {
    try {
      const item = await DataStore.query(User, itemId);
      if (item) {
        const updatedItem = User.copyOf(item, updated => {
          updated.backupKey = updatedProperties.backupKey;
          updated.publicKey = updatedProperties.publicKey;
          // Update other properties as needed
        });

        await DataStore.save(updatedItem);
        console.log('Item updated successfully');
      }
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  }

  // For Install app on new Devices.
  // Download private key from cloud
  // Convert to public key and save both to local storage
  const pKeyCloudToLocalStorage = async (
    id: string,
    name: string,
    backupKey: string,
    publicKey: string,
  ) => {
    setShowIndicator(true);
    try {
      // const cloudAccount = await DataStore.query(User, id);

      const existingAccount = authAccounts?.filter(auth => auth?.id === id);
      // const pubKey = generatePublicKeyFromSecretKey(
      //   stringToUint8Array(backupKey),
      // );

      if (existingAccount?.length === 0) {
        dispatch(
          authAccountsActions.addAuthAccount({
            id: id,
            name: name,
            backupKey: backupKey,
            publicKey: publicKey,
            keyCreatedDate: moment(),
          }),
        );
        console.log('Push new key to local storage successfully.');
      }
      // Update Auth User Account
      if (existingAccount?.length !== 0) {
        dispatch(
          authAccountsActions.updateAuthAccount({
            id: id,
            name: name,
            backupKey: backupKey,
            publicKey: publicKey,
            keyCreatedDate: moment(),
          }),
        );
      }
    } catch (error) {
      console.error('Failed to push new key to local storage:', error);
    }

    setShowIndicator(false);
  };

  // Close Ads
  const closeAdsHandler = () => {
    setClosedAds(true);
  };

  // Color scheme
  // const colorScheme = Appearance.getColorScheme();

  return (
    <>
      <OverviewProvider>
        <TransactProvider>
          <StatusBar barStyle="light-content" />
          <ActivityIndicator
            size="large"
            color="#0000ff"
            animating={showIndicator}
          />
          <FinnerNavigator />

          {/* {isAuthenticated && !closedAds && ( */}
          {!closedAds && (
            <>
              <Pressable
                style={({pressed}) => pressed && styles.pressed}
                onPress={() => closeAdsHandler()}>
                <View style={styles.close}>
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color={'grey'}
                  />
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
        </TransactProvider>
      </OverviewProvider>
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

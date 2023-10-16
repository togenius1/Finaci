import {
  ActivityIndicator,
  Alert,
  AppState,
  AppStateStatus,
  Linking,
  LogBox,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {setPRNG} from 'tweetnacl';
import {Amplify, Auth, DataStore, Hub} from 'aws-amplify';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
// import {useAppState} from '@react-native-community/hooks';

import awsconfig from './src/aws-exports';
import {generateKeyPair, PRNG} from './util/crypto';
import FinnerNavigator from './navigation/FinnerNavigator';
import {useAppDispatch, useAppSelector} from './hooks';
import {fetchCashAccountsData} from './store/cash-action';
import {fetchAccountsData} from './store/account-action';
import {fetchIncomeCategoriesData} from './store/income-category-action';
import {fetchExpenseCategoriesData} from './store/expense-category-action';
import {User} from './src/models';
import {authAccountsActions} from './store/authAccount-slice';
import moment from 'moment';
import TransactProvider from './store-context/TransactProvider';
import OverviewProvider from './store-context/OverviewProvider';
import {store} from './store';
import {clearStorageCache} from './store/cacheActions';

Amplify.configure(awsconfig);

setPRNG(PRNG);

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3212728042764573~3355076099';

const App = () => {
  // // Disable warnings for release app.
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message:
  LogBox.ignoreAllLogs(); // Ignore all log notifications: add

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

  const [closedAds, setClosedAds] = useState<boolean>(false);
  const [showIndicator, setShowIndicator] = useState<boolean>(false);
  const [latestVersion, setLatestVersion] = useState(null);

  // Fetch the latest version from the Google Play Store
  useEffect(() => {
    VersionCheck.getLatestVersion()
      .then(version => {
        setLatestVersion(version);
      })
      .catch(error => {
        console.log('Error fetching latest version:', error);
      });
  }, []);

  const currentVersion = DeviceInfo.getVersion();

  // Checking app version for updating
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
        // Fetch customer info from RevCat

        // setIsAuthenticated(true);

        // Auth.currentAuthenticatedUser().then(console.log);

        // await configurePurchases();
        await checkUserAndGenerateNewKey();
        // await getUserData();
        onCloseBannerAds();
      }
      if (data.payload.event === 'signOut') {
        // setIsAuthenticated(false);
        // await getUserData();
      }
    };

    Hub.listen('auth', listenerAuth);
  }, []);

  // Close Ads
  useEffect(() => {
    onCloseBannerAds();
  }, []);

  // Clear cache
  useEffect(() => {
    const handleAppStateChange = (newAppState: AppStateStatus) => {
      if (newAppState === 'inactive' || newAppState === 'background') {
        console.log('Cleared storage cache successfully!');
        store.dispatch(clearStorageCache());
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // No need to remove the listener here, it will be automatically removed
    };
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

      const existingAccount = authAccounts?.filter(
        auth => String(auth?.id) === id,
      );
      // const pubKey = generatePublicKeyFromSecretKey(
      //   stringToUint8Array(backupKey),
      // );

      if (Number(existingAccount?.length) === 0) {
        dispatch(
          authAccountsActions.addAuthAccount({
            id: id,
            name: name,
            backupKey: backupKey,
            publicKey: publicKey,
            keyCreatedDate: moment(),
          }),
        );
        console.log('Push the key from cloud to local storage successfully.');
      }
      // Update Auth User Account
      if (Number(existingAccount?.length) !== 0) {
        dispatch(
          authAccountsActions.updateAuthAccount({
            id: id,
            name: name,
            backupKey: backupKey,
            publicKey: publicKey,
            keyCreatedDate: moment(),
          }),
        );
        console.log('Update the key from cloud in local storage successfully.');
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

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Purchases, {LOG_LEVEL, PurchasesPackage} from 'react-native-purchases';
import PackageItem from '../components/Output/PackageItem';
import RestorePurchasesButton from '../components/UI/RestorePurchasesButton';
import moment from 'moment';

import Credits from '../components/Credits';
import {useAppDispatch, useAppSelector} from '../hooks';
import {Auth, Hub} from 'aws-amplify';
// import SignInScreen from '../navigation/NavComponents/Login/screens/SignInScreen';
import RootStackScreen from '../navigation/RootStack';
import {API_KEY, ENTITLEMENT_PRO, ENTITLEMENT_STD} from '../constants/api';
import {customerInfoActions} from '../store/customerInfo-slice';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
// import {API_KEY} from '../constants/api';

/*
 An example paywall that uses the current offering.
 */
const UserScreen = () => {
  // - Data Store (Redux)
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const customerInfo = dataLoaded?.customerInfos?.customerInfos;

  const customerInfosData = dataLoaded?.customerInfos?.customerInfos;

  // - State for all available package
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [subSTDActive, setSubSTDActive] = useState<boolean>(false);
  const [subPROActive, setSubPROActive] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [purchased, setPurchased] = useState<boolean>(false);

  useEffect(() => {
    const onAuthUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      setAuthUser(authUser);
      setIsAuthenticated(true);
    };

    onAuthUser();
  }, []);

  useEffect(() => {
    const listenerAuth = async data => {
      if (data.payload.event === 'signIn') {
        setIsAuthenticated(true);
      }
      if (data.payload.event === 'signOut') {
        setIsAuthenticated(false);
      }
    };

    Hub.listen('auth', listenerAuth);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listenerAuth); // Clean up the listener
    };
  }, []);

  // Purchase Listener
  useEffect(() => {
    if (isAuthenticated) {
      Purchases.addCustomerInfoUpdateListener(getUserData);
    }

    return () => {
      Purchases.removeCustomerInfoUpdateListener(getUserData);
    };
  }, [isAuthenticated]);

  // TODO Fetch all packages from RevenueCat
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated) {
        configurePurchasesAndFetchPackages();
        setPurchased(false);
      }
    }, [isAuthenticated, purchased]),
  );

  // Config purchase -- then fetch packages
  const configurePurchasesAndFetchPackages = async () => {
    try {
      await configurePurchases();
      await fetchPackages();
      await getUserData();
      await getCustomerData();
      // await listenPurchases();
    } catch (error) {
      console.error('Error configuring or fetching packages:', error);
    }
  };

  // Configuring Purchases
  const configurePurchases = async () => {
    try {
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
    } catch (error) {
      console.error('Error configuring Purchases:', error);
    }
  };

  // get package
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const offerings = await Purchases?.getOfferings();

      if (offerings && offerings.current !== null) {
        setPackages(offerings.current.availablePackages);
      }

      setLoading(false); // Set loading to false once packages are fetched
    } catch (error) {
      console.log('Error fetching packages:', error);
      setLoading(false); // Set loading to false in case of an error
    }
  };

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

  // Get Customer
  const getCustomerData = async () => {
    const appUserId = await Purchases.getAppUserID();
    const filteredCustomerInfo = customerInfo?.filter(
      cus => cus.appUserId === appUserId,
    );

    setUserId(filteredCustomerInfo[0]?.appUserId);
    setSubSTDActive(filteredCustomerInfo[0]?.stdActive);
    setSubPROActive(filteredCustomerInfo[0]?.proActive);
  };

  const reloadScreen = async () => {
    try {
      await configurePurchasesAndFetchPackages();
      // You might need to update other state variables here
    } catch (error) {
      console.error('Error reconfiguring or fetching packages:', error);
    }
  };

  // Header
  const header = () => <Text style={styles.PackageText}>Package items:</Text>;

  // Footer
  const footer = () => {
    // console.warn(
    //   "Modify this value to reflect your app's Privacy Policy and Terms & Conditions agreements. Required to make it through App Review.",
    // );
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.text}>Terms and Conditions: </Text>
        <Text
          style={{color: 'blue'}}
          onPress={() =>
            Linking.openURL(
              'https://www.privacypolicies.com/live/ff66f483-14db-4593-98fb-bcf5293f82dd',
            )
          }>
          link
        </Text>
      </View>
    );
  };

  // Render Item
  const renderItem = ({item}) => {
    return (
      <PackageItem
        purchasePackage={item}
        stdActive={subSTDActive}
        proActive={subPROActive}
        setPurchased={setPurchased}
        reloadScreen={reloadScreen}
      />
    );
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isAuthenticated ? (
    <>
      <View style={styles.page}>
        <View style={styles.userContainer}>
          <Text>Username:</Text>
          <Text style={styles.username}>{authUser?.username}</Text>
        </View>
        {/* The paywall flat list displaying each package */}
        <FlatList
          data={packages}
          renderItem={renderItem}
          keyExtractor={item => item.identifier}
          ListHeaderComponent={header}
          ListHeaderComponentStyle={styles.headerFooterContainer}
          ListFooterComponent={footer}
          ListFooterComponentStyle={styles.headerFooterContainer}
        />

        <RestorePurchasesButton />

        {/* {(subSTDActive || subPROActive) && <View style={styles.overlay} />} */}
      </View>

      <View style={styles.pageUser}>
        {/* The user's current app user ID and subscription status */}
        <Text style={styles.headline}>Current User Identifier</Text>
        <Text style={styles.userIdentifier}>{userId}</Text>
        <Text style={styles.headline}>Subscription/Purchase Status</Text>
        <Text
          style={{
            color: subSTDActive || subPROActive ? 'green' : 'red',
            fontWeight: subSTDActive || subPROActive ? 'bold' : '100',
          }}>
          {subSTDActive || subPROActive ? 'Active' : 'Not Active'}
        </Text>

        <Credits />
      </View>
    </>
  ) : (
    <RootStackScreen />
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  page: {
    padding: 16,
  },
  userContainer: {
    // justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  username: {
    color: '#0634eb',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 20,
  },
  PackageText: {
    color: 'grey',
  },
  headerFooterContainer: {
    marginVertical: 10,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
  },
  pageUser: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    padding: 36,
    backgroundColor: '#e6f3ff',
  },
  headline: {
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 18,
    // paddingVertical: 8,
  },
  userIdentifier: {
    color: '#000000',
  },
});

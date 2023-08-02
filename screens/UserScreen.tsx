import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  // DevSettings,
  ActivityIndicator,
} from 'react-native';
import Purchases from 'react-native-purchases';
import PackageItem from '../components/Output/PackageItem';
import RestorePurchasesButton from '../components/UI/RestorePurchasesButton';

import Credits from '../components/Credits';
import {useAppSelector} from '../hooks';
import {Auth, Hub} from 'aws-amplify';
import SignInScreen from '../navigation/NavComponents/Login/screens/SignInScreen';

/*
 An example paywall that uses the current offering.
 */
const UserScreen = () => {
  // - Data Store (Redux)
  const dataLoaded = useAppSelector(store => store);

  const customerInfo = dataLoaded?.customerInfos?.customerInfos;

  // - State for all available package
  const [packages, setPackages] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [subSTDActive, setSubSTDActive] = useState<boolean>(false);
  const [subPROActive, setSubPROActive] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const onAuthUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      setAuthUser(authUser);
      setIsAuthenticated(true);
    };

    onAuthUser();
  }, [isAuthenticated]);

  useEffect(() => {
    const listenerAuth = async data => {
      if (data.payload.event === 'signIn') {
        setIsAuthenticated(true);

        await packageHandler();
      }
      if (data.payload.event === 'signOut') {
        setIsAuthenticated(false);
      }
    };

    Hub.listen('auth', listenerAuth);
  }, []);

  // // TODO Fetch all packages from RevenueCat
  useEffect(() => {
    const packages = async () => {
      await packageHandler();
    };
    packages();
  }, [isAuthenticated]);

  // Get Customer data
  useEffect(() => {
    getCustomerData();
  }, []);

  // get package
  const packageHandler = async () => {
    try {
      const offerings = await Purchases?.getOfferings();

      if (offerings.current !== null) {
        // Display current offering with offerings.current
        setPackages(offerings.current.availablePackages);
      }

      setLoading(false); // Set loading to false once packages are fetched
    } catch (e) {
      console.log('error: ', e);
      setLoading(false); // Set loading to false in case of an error
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
    <SignInScreen />
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

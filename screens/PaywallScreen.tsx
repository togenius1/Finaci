import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Alert, StyleSheet} from 'react-native';
import Purchases from 'react-native-purchases';
import PackageItem from '../components/Output/PackageItem';
import RestorePurchasesButton from '../components/UI/RestorePurchasesButton';
import moment from 'moment';

import SignInScreen from '../navigation/NavComponents/Login/screens/SignInScreen';
import CButton from '../components/UI/CButton';
import {Auth} from 'aws-amplify';
import Credits from '../components/Credits';
import {ENTITLEMENT_PRO, ENTITLEMENT_STD} from '../constants/api';
import LoginForm from '../components/Form/LoginForm';
import LogoutButton from '../components/UI/LogoutButton';
import {useAppSelector} from '../hooks';

/*
 An example paywall that uses the current offering.
 */
const PaywallScreen = () => {
  // - Data Store (Redux)
  const dataLoaded = useAppSelector(store => store);

  const customerInfo = dataLoaded?.customerInfos?.customerInfos;

  // - State for all available package
  const [packages, setPackages] = useState<any[]>([]);
  // - State for displaying an overlay view
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [subscriptionActive, setSubscriptionActive] = useState<boolean>(false);
  const [subSTDActive, setSubSTDActive] = useState<boolean>(false);
  const [subPROActive, setSubPROActive] = useState<boolean>(false);

  // TODO Fetch all packages from RevenueCat
  useEffect(() => {
    const getPackages = async () => {
      try {
        const offerings = await Purchases?.getOfferings();

        if (offerings.current !== null) {
          // Display current offering with offerings.current
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        console.log('error: ', e);
      }
    };

    getPackages();
  }, []);

  // Get Customer data
  useEffect(() => {
    getCustomerData();
  }, []);

  // Header
  const header = () => <Text style={styles.text}>Finner Premium</Text>;

  // Footer
  const footer = () => {
    console.warn(
      "Modify this value to reflect your app's Privacy Policy and Terms & Conditions agreements. Required to make it through App Review.",
    );
    return (
      <Text style={styles.text}>
        Don't forget to add your subscription terms and conditions. Read more
        about this here:
        https://www.revenuecat.com/blog/schedule-2-section-3-8-b
      </Text>
    );
  };

  const getCustomerData = async () => {
    const appUserId = await Purchases.getAppUserID();
    const filteredCustomerInfo = customerInfo?.filter(
      cus => cus.appUserId === appUserId,
    );

    setUserId(filteredCustomerInfo[0]?.appUserId);
    setSubSTDActive(filteredCustomerInfo[0]?.stdActive);
    setSubPROActive(filteredCustomerInfo[0]?.proActive);
  };

  // Render Item
  const renderItem = ({item}) => {
    return (
      <PackageItem
        purchasePackage={item}
        // setIsPurchasing={setIsPurchasing}
      />
    );
  };

  return (
    <>
      <View style={styles.page}>
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
  );
};

export default PaywallScreen;

const styles = StyleSheet.create({
  page: {
    padding: 16,
  },
  text: {
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
    padding: 30,
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

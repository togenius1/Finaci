import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Alert, StyleSheet, Linking} from 'react-native';
import Purchases from 'react-native-purchases';
import PackageItem from '../components/Output/PackageItem';
import RestorePurchasesButton from '../components/UI/RestorePurchasesButton';

import Credits from '../components/Credits';
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
  const [userId, setUserId] = useState<string | null>(null);
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
  const header = () => <Text style={styles.text}>Finner items:</Text>;

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
        stdActive={subSTDActive}
        proActive={subPROActive}
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

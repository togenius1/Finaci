import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  Platform,
  ActivityIndicator,
  // Pressable,
  Dimensions,
  Modal,
} from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';
import PackageItem from '../components/Output/PackageItem';
import RestorePurchasesButton from '../components/UI/RestorePurchasesButton';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Credits from '../components/Credits';
import {useAppDispatch, useAppSelector} from '../hooks';
import {Auth, Hub} from 'aws-amplify';
// import SignInScreen from '../navigation/NavComponents/Login/screens/SignInScreen';
import RootStackScreen from '../navigation/RootStack';
import {
  API_KEY_ANDROID,
  API_KEY_IOS,
  ENTITLEMENT_PRO,
  ENTITLEMENT_STD,
} from '../constants/api';
import {customerInfoActions} from '../store/customerInfo-slice';
// import {API_KEY} from '../constants/api';

const {width, height} = Dimensions.get('window');

// const HeaderRightComponent = ({
//   setIsMenuOpen, // setIsMYListVisible,
//   // year,
// } // month,
// : HeaderRightComponentType) => {
//   return (
//     <View style={styles.headerRight}>
//       <Pressable
//         style={({pressed}) => pressed && styles.pressed}
//         onPress={() => {}}>
//         <View
//           style={{
//             // backgroundColor: '#ffd3d3',
//             marginRight: 25,
//           }}>
//           <Text style={{fontSize: 16, color: '#2a8aff'}}>
//             {/* {monthLabel} {year} */}
//           </Text>
//         </View>
//       </Pressable>

//       <Pressable
//         style={({pressed}) => pressed && styles.pressed}
//         onPress={setIsMenuOpen}>
//         <View
//           style={{
//             justifyContent: 'center',
//             alignItems: 'center',
//             // backgroundColor: '#ffd3d3',
//             marginRight: 15,
//           }}>
//           <MaterialCommunityIcons
//             name={'dots-vertical'}
//             size={width * 0.06}
//             color={'black'}
//           />
//         </View>
//       </Pressable>
//     </View>
//   );
// };

const UserScreen = ({}) => {
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
  // const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // useEffect(() => {
  //   navigation.setOptions({
  //     title: '',
  //     headerTitleAlign: 'right',
  //     headerRight: () => (
  //       <HeaderRightComponent
  //         setIsMenuOpen={() => setIsMenuOpen(true)}
  //         // setIsMYListVisible={setIsMYListVisible}
  //         // year={year}
  //         // month={month}
  //       />
  //     ),
  //   });
  // }, []);

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
      const res = await configurePurchases();

      if (res) {
        await fetchPackages();
        await getUserData();
        await getCustomerData();
        // await listenPurchases();
      }
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
        Purchases.configure({
          apiKey: API_KEY_IOS,
          appUserID: authUser?.attributes?.sub,
        });
      } else if (Platform.OS === 'android') {
        // Purchases.configure({apiKey: API_KEY});
        Purchases.configure({
          apiKey: API_KEY_ANDROID,
          appUserID: authUser?.attributes?.sub,
        });

        // OR: if building for Amazon, be sure to follow the installation instructions then:
        //  Purchases.configure({ apiKey: <public_amazon_sdk_key>, useAmazon: true });
      }

      return true;
    } catch (error) {
      console.error('Error configuring Purchases:', error);
    }
  };

  // get package
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const offerings = await Purchases.getOfferings();

      if (offerings.current !== null) {
        setPackages(offerings?.current?.availablePackages);
      }

      setLoading(false); // Set loading to false once packages are fetched
    } catch (error) {
      console.log('Error fetching packages:', error);
    }
    setLoading(false); // Set loading to false in case of an error
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
      cus => String(cus?.appUserId) === appUserId,
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
      cus => String(cus?.appUserId) === appUserId,
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

      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuOpen}
        onDismiss={() => setIsMenuOpen(false)}
        onRequestClose={() => setIsMenuOpen(false)}>
        <Pressable style={styles.outSide} onPress={() => setIsMenuOpen(false)}>
          <Pressable onPress={() => setIsMenuOpen(true)}>
            <View style={styles.menu}>
              <Pressable
                // onPress={openAddAccountForm}
                style={({pressed}) => pressed && styles.pressed}>
                <View style={styles.addContainer}>
                  <Text style={styles.addText}>Add</Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal> */}
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
  menu: {
    width: width * 0.45,
    height: height * 0.2,
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'black',

    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,

    position: 'absolute',
    right: 0,
    top: height / 16,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContainer: {
    marginTop: 25,
    marginLeft: 15,
    // borderWidth: 0.25,
    // borderColor: 'grey',
  },
  addText: {
    fontSize: width * 0.045,
    fontWeight: '500',
    color: '#0362de',
  },
  outSide: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.65,
  },
});

//========================= TYPE =======================================
// type HeaderRightComponentType = {
//   setIsMenuOpen: (value: React.SetStateAction<boolean>) => void;
// };

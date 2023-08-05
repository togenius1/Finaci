import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Auth, Hub} from 'aws-amplify';
import moment from 'moment';

import {xport} from '../../util/xport';
import {useAppSelector} from '../../hooks';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';

// Ads variable
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-3212728042764573~3355076099';

const {width} = Dimensions.get('window');

const Export = () => {
  // const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const customerInfosData = dataLoaded?.customerInfos?.customerInfos;

  // const [jsonData, setJsonData] = useState();
  const [newJson, setNewJson] = useState();

  const navigation = useNavigation();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // const [authUser, setAuthUser] = useState<any>();

  const {isLoaded, isClosed, load, show} = useInterstitialAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  // Load ads
  useEffect(() => {
    // Start loading the interstitial straight away
    load();
  }, [load]);

  // Load ads again
  useEffect(() => {
    if (isClosed) {
      // console.log('Reloading ad...');
      load();
    }
  }, [isClosed]);

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
  }, []);

  // Check if authenticated user, Stay logged in.
  useEffect(() => {
    const onAuthUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      // setAuthUser(authUser);
      setIsAuthenticated(true);
    };

    onAuthUser();
  }, []);

  useEffect(() => {
    createNewObject();
  }, []);

  // Export format.
  const createNewObject = () => {
    const obj = dataLoaded?.expenses?.expenses?.map((expense, index) => {
      // income
      const incomeObj = dataLoaded?.incomes.incomes?.find(
        income =>
          moment(income.date).format('YYYY-MM-DD') ===
          moment(expense.date).format('YYYY-MM-DD'),
      );

      let incomeAccountObj;
      const incomeCateObj =
        dataLoaded?.incomeCategories?.incomeCategories?.find(
          cate => cate.id === incomeObj?.cateId,
        );

      incomeAccountObj = dataLoaded?.cashAccounts?.cashAccounts?.find(
        cash => cash.id === incomeObj?.accountId,
      );
      if (incomeAccountObj === undefined) {
        incomeAccountObj = dataLoaded?.accounts?.accounts?.find(
          account => account?.id === incomeObj?.accountId,
        );
      }

      // expense
      let expenseAccountObj;
      const expenseCateObj =
        dataLoaded?.expenseCategories?.expenseCategories?.find(
          cate => cate.id === expense?.cateId,
        );

      expenseAccountObj = dataLoaded?.cashAccounts?.cashAccounts?.find(
        cate => cate.id === expense?.accountId,
      );
      if (expenseAccountObj === undefined) {
        expenseAccountObj = dataLoaded?.accounts?.accounts?.find(
          cate => cate?.id === expense?.accountId,
        );
      }

      return {
        No: index + 1,
        Expense_Account: expenseAccountObj?.title,
        Expense: expense?.amount,
        Expense_Category: expenseCateObj?.title,
        Expense_Note: expense?.note,
        Expense_Date: moment(expense?.date).format('YYYY-MM-DD HH:mm:ss'),
        '': '',
        Income_Account: incomeAccountObj?.title,
        Income: incomeObj?.amount,
        Income_Category: incomeCateObj?.title,
        Income_Note: incomeObj?.note,
        Income_Date: moment(incomeObj?.date).format('YYYY-MM-DD HH:mm:ss'),
      };
    });
    setNewJson(obj);
  };

  // Action after the ad is closed
  // useEffect(() => {
  //   if (isClosed) {
  //     exportHandler();
  //   }
  // }, [isClosed]);

  // Check Pro or standard
  const checkPro = async () => {
    if (isAuthenticated) {
      // const authUser = await Auth.currentAuthenticatedUser();
      // const appUserId = authUser?.attributes?.sub;
      // const filteredCustomerInfo = customerInfosData?.filter(
      //   cus => cus.appUserId === appUserId,
      // );

      // if (
      //   filteredCustomerInfo[0]?.stdActive === false &&
      //   filteredCustomerInfo[0]?.proActive === false
      // ) {
      //   // show Ads
      //   if (isLoaded) {
      //     show();
      //   }

      //   // Action after the ad is closed
      //   // if (isClosed) {
      //   //   await exportHandler();
      //   // }
      // } else if (
      //   filteredCustomerInfo[0]?.stdActive === true ||
      //   filteredCustomerInfo[0]?.proActive === true
      // ) {
      await exportHandler();
      // }
    } else if (!isAuthenticated) {
      Alert.alert(
        'You have not signed in yet!',
        'Please sign in now.',
        [
          {
            text: 'Yes',
            onPress: () => navigation.navigate('User'),
            style: 'destructive',
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
          // onDismiss: () =>
          //   Alert.alert(
          //     'This alert was dismissed by tapping outside of the alert dialog.',
          //   ),
        },
      );
    }
  };

  // Export
  const exportHandler = async () => {
    await xport(newJson);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
            Export <Text style={{fontSize: 12}}>(Raw data)</Text>
          </Text>
        </View>

        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => checkPro()}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18}}>Excel (.xls)</Text>
            <Text style={{fontSize: 14}}>
              Export your data via the .xls files
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Export;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    width,
    height: 100,
    elevation: 3,
    shadowColor: '#c6c6c6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  inner: {
    marginLeft: 20,
  },
  exportsContainer: {
    marginLeft: 20,
    marginTop: 50,
  },
  pressed: {
    opacity: 0.75,
  },
});

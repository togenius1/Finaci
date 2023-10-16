import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {prefetchConfiguration} from 'react-native-app-auth';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
// import {v4 as uuidv4} from 'uuid';
import {useInterstitialAd, TestIds} from 'react-native-google-mobile-ads';
import {Auth, Hub} from 'aws-amplify';

import {defaultAuthState} from '../constants/authConfig';
import {decryption} from '../util/decrypt';
import {encryption} from '../util/encrypt';
import {
  fetchCreateFile,
  fetchCreateFolder,
  fetchFindFolder,
} from '../util/fetchData';
import {authorization, refreshAuthorize} from '../util/auth';
import {useAppDispatch, useAppSelector} from '../hooks';
import {expenseActions} from '../store/expense-slice';
import {incomeActions} from '../store/income-slice';
import {dailyTransactsActions} from '../store/dailyTransact-slice';
import {monthlyTransactsActions} from '../store/monthlyTransact-slice';
import {weeklyTransactsActions} from '../store/weeklyTransact-slice';
import {accountActions} from '../store/account-slice';
import {cashAccountsActions} from '../store/cash-slice';
import {useNavigation} from '@react-navigation/native';

// Ads variable
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-3212728042764573~3355076099';

// Constant
const {width, height} = Dimensions.get('window');
// const sec_1 = 1000;
// const minute_1 = sec_1 * 60;
// const minute_5 = minute_1 * 5;
// const minute_15 = minute_5 * 3;
// const hour = minute_15 * 4;
// const day = hour * 24;
// const SevenDays = day * 7;
// const month = day * 30;

// Main
const BackupScreen = () => {
  const navigation = useNavigation();

  const [showBackupIndicator, setShowBackupIndicator] =
    useState<boolean>(false);
  const [showRestoreIndicator, setShowRestoreIndicator] =
    useState<boolean>(false);
  const [authCurrentAccount, setAuthCurrentAccount] = useState<any[]>([]);
  const [authState, setAuthState] = useState<AuthStateType>(defaultAuthState);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  // const [isExpenseBoxChecked, setIsExpenseBoxChecked] = useState<boolean | undefined>(false);
  const auth = useRef<string | null>('');
  const timerRef = useRef();
  // const [expensesData, setexpensesData] = useState<ExpenseType>();
  const dispatch = useAppDispatch();
  const rootStore = useAppSelector(store => store);

  const customerInfosData = rootStore?.customerInfos?.customerInfos;

  const authAccountsData = rootStore?.authAccounts?.authAccounts;
  const expensesData = rootStore?.expenses?.expenses;
  // const incomesData = rootStore?.incomes?.incomes;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<any>();

  const {isLoaded, isClosed, load, show} = useInterstitialAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  // Check if authenticated user, Stay logged in.
  useEffect(() => {
    const onAuthUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      setAuthUser(authUser);
      setIsAuthenticated(true);
    };

    onAuthUser();
  }, []);

  // Listening for Login events.
  useEffect(() => {
    const listenerAuth = async data => {
      if (data.payload.event === 'signIn') {
        // DevSettings.reload();
        setIsAuthenticated(true);
      }
      if (data.payload.event === 'signOut') {
        setIsAuthenticated(false);
      }
    };

    Hub.listen('auth', listenerAuth);
  }, []);

  // Load ads
  useEffect(() => {
    // Start loading the interstitial straight away
    load();
  }, [load]);

  // Load ads again
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed]);

  useEffect(() => {
    const setAccount = async () => {
      const authedUser = await Auth.currentAuthenticatedUser();
      const subId: string = authedUser?.attributes?.sub;

      const filterAuthAccount = authAccountsData?.filter(
        auth => String(auth.id) === subId,
      );

      setAuthCurrentAccount(filterAuthAccount);
    };

    setAccount();
  }, []);

  // useEffect(() => {
  //   // setexpensesData(EXPENSES);
  //   setUpKey();
  // }, []);

  // useEffect(() => {
  //   prefetchConfiguration({
  //     warmAndPrefetchChrome: true,
  //     connectionTimeoutSeconds: 5,
  //     ...configs.auth0,
  //   });
  // }, []);

  // Timer to backup. Should move to the App file?
  // useEffect(() => {
  //   timerRef.current = setInterval(() => {
  //     Alert.alert(
  //       'Back up data.',
  //       'Do you want to back up your data now?',
  //       [
  //         {
  //           text: 'Yes',
  //           onPress: () => backupHandler(rootStore),
  //           // style: 'cancel',
  //         },
  //         // {
  //         //   text: 'Delete',
  //         //   // onPress: () => removeAccountHandler(item?.id),
  //         // },
  //         {
  //           text: 'No',
  //           style: 'cancel',
  //         },
  //       ],
  //       {
  //         cancelable: true,
  //         // onDismiss: () =>
  //         //   Alert.alert(
  //         //     'This alert was dismissed by tapping outside of the alert dialog.',
  //         //   ),
  //       },
  //     );
  //     // backupHandler(expensesData);
  //   }, SevenDays);
  //   () => clearInterval(timerRef.current);
  // }, []);

  useEffect(() => {
    authHandler();
  }, [authState]);

  const authHandler = () => {
    const accessToken = authState?.accessToken;
    const authh = `Bearer ${accessToken}`;
    auth.current = authh;
  };

  const handleAuthorize = useCallback(
    async provider => {
      await authorization(provider, setAuthState);
    },
    [authState],
  );

  const handleRefresh = useCallback(async () => {
    await refreshAuthorize(authState, setAuthState);
  }, [authState]);

  // Action after the ad is closed
  useEffect(() => {
    if (isClosed) {
      backupAlert(rootStore);
    }
  }, [isClosed]);

  // Sign in Alert
  const signInAlert = () => {
    Alert.alert(
      'You have not yet signed in!',
      'Please sign in now.',
      [
        {
          text: 'Yes',
          onPress: () => navigation.navigate('User'),
          // style: 'cancel',
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
  };

  // check pro user
  const checkProUserBackHandler = async () => {
    if (isAuthenticated) {
      const appUserId = authUser?.attributes?.sub;
      const filteredCustomerInfo = customerInfosData?.filter(
        cus => cus.appUserId === appUserId,
      );

      if (
        String(filteredCustomerInfo[0]?.stdActive) === 'false' &&
        String(filteredCustomerInfo[0]?.proActive) === 'false'
      ) {
        // show Ads
        if (isLoaded) {
          show();
        } else {
          await backupAlert();
        }
      } else if (
        String(filteredCustomerInfo[0]?.stdActive) === 'true' ||
        String(filteredCustomerInfo[0]?.proActive) === 'true'
      ) {
        await backupAlert();
      }
    } else if (!isAuthenticated) {
      signInAlert();
    }
  };

  // Backup Alert
  const backupAlert = async () => {
    Alert.alert(
      'Back up data!',
      'Do you want to back up your data now?',
      [
        {
          text: 'Yes',
          onPress: () => backupHandler(rootStore),
          // style: 'cancel',
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
  };

  // Backup
  const backupHandler = async obj => {
    setShowBackupIndicator(true);

    const PRIVATE_KEY: string = authCurrentAccount[0]?.backupKey;
    const PUBLIC_KEY: string = authCurrentAccount[0]?.publicKey;

    const encrypted = await encryption(obj, PRIVATE_KEY, PUBLIC_KEY);

    const id = authCurrentAccount[0]?.id;

    const d = new Date();
    const mm = d.getMonth() + 1;
    let dd = d.getDate();
    const yy = d.getFullYear();
    const time = d.getTime();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    const fileName = `Finner_backup_${id}_${dd}${mm}${yy}${time}.bak`;

    const today = new Date();
    const expireAccessToken = new Date(authState.accessTokenExpirationDate);
    if (!authState.hasLoggedInOnce || today === expireAccessToken) {
      await handleAuthorize('auth0');
    } else {
      await handleRefresh();
    }
    setShowBackupIndicator(false);
    await findFolderAndInsertFile(encrypted, fileName);
    // setShowBackupIndicator(false);
  };

  // Check Pro user
  const checkProUserRestoreHandler = async () => {
    if (!isAuthenticated) {
      signInAlert();
      // return;
    } else if (isAuthenticated) {
      const authUser = await Auth.currentAuthenticatedUser();
      const appUserId = authUser?.attributes?.sub;
      const filteredCustomerInfo = customerInfosData?.filter(
        cus => cus.appUserId === appUserId,
      );

      if (String(filteredCustomerInfo[0]?.proActive) === 'false') {
        Alert.alert(
          'This function is available for Pro users."',
          'Would you like to upgrade to Pro (Premium)?',
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
      } else {
        askToRestoreData();
      }
    }
  };

  // Ask to import data
  const askToRestoreData = () => {
    // Ask to replace the old?
    Alert.alert(
      'Your existing data will be replaced with new data.',
      'Would you like to restore the data?',
      [
        {
          text: 'Yes',
          onPress: () => restoreHandler(),
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
  };

  // Restore data from google drive
  const restoreHandler = async () => {
    setShowRestoreIndicator(true);

    const PRIVATE_KEY: string = authCurrentAccount[0]?.backupKey;
    const PUBLIC_KEY: string = authCurrentAccount[0]?.publicKey;

    const pickedFile = await handleDocumentSelection();

    const uri = pickedFile?.uri;
    const encryptedData = await RNFS.readFile(uri, 'ascii')
      .then(result => {
        return result;
      })
      .catch(err => {
        console.log(err.message, err.code);
      });

    const decrypted = await decryption(
      String(encryptedData),
      PRIVATE_KEY,
      PUBLIC_KEY,
    );

    if (decrypted === undefined) {
      setShowRestoreIndicator(false);
      Alert.alert('No data to restore.');
      return;
    }

    // indicator
    setShowRestoreIndicator(false);

    // Replace accounts
    replaceCashDataToStorage(decrypted?.cashAccounts?.cashAccounts);
    replaceAccountsDataToStorage(decrypted?.accounts?.accounts);

    // Replace expense/income data to local storage
    replaceNewIncomeDataToStorage(decrypted?.incomes.incomes);
    replaceNewExpenseDataToStorage(decrypted?.expenses.expenses);

    // Calculate and update new monthly transaction,
    monthlyTransactionsUpdate(decrypted?.monthlyTransacts?.monthlyTransacts);
    // Calculate and update new weekly transaction,
    weeklyTransactionsUpdate(decrypted?.weeklyTransacts?.weeklyTransacts);
    // Calculate and update new daily transaction,
    dailyTransactionsUpdate(decrypted?.dailyTransacts?.dailyTransacts);
  };

  // Replace the old expense data in storage with imported data
  const replaceCashDataToStorage = obj => {
    dispatch(
      cashAccountsActions.replaceCashAccount({
        cashAccounts: obj,
      }),
    );
  };

  // Replace the old expense data in storage with imported data
  const replaceAccountsDataToStorage = obj => {
    dispatch(
      accountActions.replaceAccount({
        accounts: obj,
      }),
    );
  };

  // Replace the old expense data in storage with imported data
  const replaceNewExpenseDataToStorage = obj => {
    dispatch(
      expenseActions.replaceExpenses({
        expenses: obj,
      }),
    );
  };

  // Replace the old income data in storage with imported data
  const replaceNewIncomeDataToStorage = object => {
    dispatch(
      incomeActions.replaceIncome({
        incomes: object,
      }),
    );
  };

  // Calculate and update new monthly transaction,
  const monthlyTransactionsUpdate = object => {
    // const monthlyTransact = sumTransactionByMonth(object);

    // Replace new monthly transaction to storage
    dispatch(
      monthlyTransactsActions.replaceMonthlyTransacts({
        monthlyTransacts: object,
      }),
    );
  };

  // Calculate and update new weekly transaction,
  const weeklyTransactionsUpdate = object => {
    // const weeklyTransacts = (await sumTransactionByWeek(object))[0];

    // Replace new weekly transaction to storage
    dispatch(
      weeklyTransactsActions.replaceWeeklyTransacts({
        weeklyTransacts: object,
      }),
    );
  };

  // Calculate and update new daily transaction,
  const dailyTransactionsUpdate = object => {
    // const dailyTransacts = sumTransactionByDay(object);

    // Replace new daily transaction to storage
    dispatch(
      dailyTransactsActions.replaceDailyTransacts({
        dailyTransacts: object,
      }),
    );
  };

  // Create folder
  async function createFolder(fileName: string) {
    const folderObj = await fetchCreateFolder(auth.current, expensesData, '');
    return folderObj;
  }

  // Find Folder in the google drive.
  async function FindFolderInGoogleDrive() {
    setIsLoading(true);
    const folders = await fetchFindFolder(auth.current);
    setIsLoading(false);
    return folders;
  }

  // Fin any folders in the local storage.
  async function findFolderAndInsertFile(
    encryptedData: string,
    fileName: string,
  ) {
    let folderId: string | null;
    folderId = await AsyncStorage.getItem('@folderbackup_key');
    const folderInDrive = await FindFolderInGoogleDrive();

    const foundFolderId = folderInDrive.files?.find(fd => fd.id === folderId)
      ?.id;

    if (!folderId || !foundFolderId) {
      const folderObj = await createFolder(fileName);
      await AsyncStorage.setItem('@folderbackup_key', folderObj?.id);
      folderId = folderObj?.id;

      await fetchCreateFile(
        auth.current,
        encryptedData,
        String(folderId),
        fileName,
      );
    } else {
      await fetchCreateFile(auth.current, encryptedData, folderId, fileName);
    }
  }

  // Select file from Storage
  const handleDocumentSelection = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
      });
      return response;
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: width * 0.058,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Backup and Restore
          </Text>
        </View>

        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => checkProUserBackHandler()}>
            <View style={{marginTop: 20}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: width * 0.048, fontWeight: 'bold'}}>
                  Backup
                </Text>
                <Text style={{fontSize: width * 0.03}}> (Google drive)</Text>
              </View>
              <Text style={{fontSize: width * 0.035}}>
                Backup your data to cloud storage
              </Text>
            </View>
          </Pressable>
          <ActivityIndicator
            size="small"
            color="#0000ff"
            animating={showBackupIndicator}
          />
        </View>

        <View style={{flexDirection: 'row'}}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => checkProUserRestoreHandler()}>
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: width * 0.048, fontWeight: 'bold'}}>
                Restore
              </Text>
              <Text style={{fontSize: width * 0.035}}>
                Restore your data from cloud storage
              </Text>
            </View>
          </Pressable>
          <ActivityIndicator
            size="small"
            color="#0000ff"
            animating={showRestoreIndicator}
          />
        </View>
      </View>
    </View>
  );
};

export default BackupScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    width,
    height: height / 3,
    elevation: 3,
    shadowColor: '#c6c6c6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  inner: {
    marginLeft: width * 0.065,
  },
  pressed: {
    opacity: 0.75,
  },
});

// ================================ TYPE Interface =============================================
interface AuthStateType {
  hasLoggedInOnce: boolean;
  provider: string;
  accessToken: string;
  accessTokenExpirationDate: string;
  refreshToken: string;
}

import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {prefetchConfiguration} from 'react-native-app-auth';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {v4 as uuidv4} from 'uuid';

import {configs, defaultAuthState} from '../util/authConfig';
import {decryption} from '../util/decrypt';
import {encryption} from '../util/encrypt';
import {
  fetchCreateFile,
  fetchCreateFolder,
  fetchFindFolder,
} from '../util/fetchData';
import {authorization, refreshAuthorize} from '../util/auth';
import {Auth, DataStore} from 'aws-amplify';
import {
  generatePublicKeyFromSecretKey,
  PRIVATE_KEY,
  PUBLIC_KEY,
  stringToUint8Array,
} from '../util/crypto';
import {User} from '../src/models';
import {useAppDispatch, useAppSelector} from '../hooks';
import {expenseActions} from '../store/expense-slice';
import {incomeActions} from '../store/income-slice';
import moment from 'moment';
import {
  sumByDate,
  sumByMonth,
  sumTransactionByDay,
  sumTransactionByMonth,
  sumTransactionByWeek,
} from '../util/math';
import {dailyTransactsActions} from '../store/dailyTransact-slice';
import {monthlyTransactsActions} from '../store/monthlyTransact-slice';
import {weeklyTransactsActions} from '../store/weeklyTransact-slice';

// Constant
const {width} = Dimensions.get('window');
const sec_1 = 1000;
const minute_1 = sec_1 * 60;
const minute_5 = minute_1 * 5;
const minute_15 = minute_5 * 3;
const hour = minute_15 * 4;
const day = hour * 24;
const SevenDays = day * 7;
const month = day * 30;

// Main
const BackupScreen = () => {
  const [authState, setAuthState] = useState<AuthStateType>(defaultAuthState);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  // const [isExpenseBoxChecked, setIsExpenseBoxChecked] = useState<boolean | undefined>(false);
  const auth = useRef<string | null>('');
  const timerRef = useRef();
  // const [expensesData, setexpensesData] = useState<ExpenseType>();
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);
  const expensesData = dataLoaded?.expenses?.expenses;
  const incomesData = dataLoaded?.incomes?.incomes;

  // [0] ==> incomesData, [1] ==> expensesData
  const incomeAndExpenseObj = [incomesData, expensesData];

  useEffect(() => {
    // setexpensesData(EXPENSES);
    setUpKey();
  }, []);

  // useEffect(() => {
  //   prefetchConfiguration({
  //     warmAndPrefetchChrome: true,
  //     connectionTimeoutSeconds: 5,
  //     ...configs.auth0,
  //   });
  // }, []);

  // Timer to backup. Should move to the App file?
  useEffect(() => {
    timerRef.current = setInterval(() => {
      Alert.alert(
        'Backup data!',
        'Do you want to backup your data now?',
        [
          {
            text: 'Yes',
            onPress: () => backupHandler(incomeAndExpenseObj),
            // style: 'cancel',
          },
          // {
          //   text: 'Delete',
          //   // onPress: () => removeAccountHandler(item?.id),
          // },
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
      // backupHandler(expensesData);
    }, SevenDays);
    () => clearInterval(timerRef.current);
  }, []);

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

  // Backup Alert
  const backupAlert = obj => {
    Alert.alert(
      'Backup data!',
      'Do you want to backup your data now?',
      [
        {
          text: 'Yes',
          onPress: () => backupHandler(obj),
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
    const encrypted = await encryption(obj);

    const d = new Date();
    const mm = d.getMonth() + 1;
    let dd = d.getDate();
    const yy = d.getFullYear();
    const time = d.getTime();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    const fileName = `Finner_backup${dd}${mm}${yy}${time}.bak`;

    const today = new Date();
    const expireAccessToken = new Date(authState.accessTokenExpirationDate);
    if (!authState.hasLoggedInOnce || today === expireAccessToken) {
      await handleAuthorize('auth0');
    } else {
      await handleRefresh();
    }
    await findFolderAndInsertFile(encrypted, fileName);
  };

  // Ask to import data
  const askToRestoreData = () => {
    // Ask to replace the old?
    Alert.alert(
      'Do you want to restore an expense data?',
      'Your old data on your phone will be replaced with the new data!',
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
    const pickedFile = await handleDocumentSelection();

    const uri = pickedFile?.uri;
    const encryptedData = await RNFS.readFile(uri, 'ascii')
      .then(result => {
        return result;
      })
      .catch(err => {
        console.log(err.message, err.code);
      });

    const decrypted = await decryption(String(encryptedData));
    // return decrypted;

    // Replace expense/income data to local storage
    await replaceNewIncomeDataToStorage(decrypted[0]);
    await replaceNewExpenseDataToStorage(decrypted[1]);

    // Calculate and update new monthly transaction,
    monthlyTransactionsUpdate(decrypted);
    // Calculate and update new weekly transaction,
    weeklyTransactionsUpdate(decrypted);
    // Calculate and update new daily transaction,
    dailyTransactionsUpdate(decrypted);
  };

  // Replace the old expense data in storage with imported data
  const replaceNewExpenseDataToStorage = async obj => {
    dispatch(
      expenseActions.replaceExpenses({
        expenses: obj,
      }),
    );
  };

  // Replace the old income data in storage with imported data
  const replaceNewIncomeDataToStorage = async obj => {
    dispatch(
      incomeActions.replaceIncome({
        incomes: obj,
      }),
    );
  };

  // Calculate and update new monthly transaction,
  const monthlyTransactionsUpdate = async object => {
    const monthlyTransact = await sumTransactionByMonth(object);

    // Replace new monthly transaction to storage
    dispatch(
      monthlyTransactsActions.replaceMonthlyTransacts({
        monthlyTransacts: monthlyTransact,
      }),
    );
  };

  // Calculate and update new weekly transaction,
  const weeklyTransactionsUpdate = async object => {
    const weeklyTransacts = sumTransactionByWeek(object);

    // Replace new weekly transaction to storage
    dispatch(
      weeklyTransactsActions.replaceWeeklyTransacts({
        weeklyTransacts: weeklyTransacts,
      }),
    );
  };

  // Calculate and update new daily transaction,
  const dailyTransactionsUpdate = async object => {
    console.log('daily: ');
    const dailyTransacts = sumTransactionByDay(object);

    // Replace new daily transaction to storage
    dispatch(
      dailyTransactsActions.replaceDailyTransacts({
        dailyTransacts: dailyTransacts,
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

    const foundFolderId = folderInDrive.files?.find(
      fd => fd.id === folderId,
    )?.id;

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

  const setUpKey = async () => {
    try {
      // const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUser = await DataStore.query(User, authUser.attributes.sub);
      // setCurrentUser(dbUser);

      // Remove Old Key
      await AsyncStorage.removeItem(PRIVATE_KEY);
      await AsyncStorage.removeItem(PUBLIC_KEY);

      const cloudPrivateKey = String(dbUser?.backupKey);
      await AsyncStorage.setItem(PRIVATE_KEY, cloudPrivateKey);

      const publicKey = generatePublicKeyFromSecretKey(
        stringToUint8Array(cloudPrivateKey),
      );
      await AsyncStorage.setItem(PUBLIC_KEY, String(publicKey?.publicKey));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View>
          <Text
            style={{
              fontSize: width * 0.058,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Backup and Restore{' '}
            <Text style={{fontSize: 12}}>(Google drive)</Text>
          </Text>
        </View>

        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => backupAlert(incomeAndExpenseObj)}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: width * 0.048, fontWeight: 'bold'}}>
              Backup
            </Text>
            <Text style={{fontSize: 14}}>
              Backup your data to cloud storage
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => askToRestoreData()}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: width * 0.048, fontWeight: 'bold'}}>
              Restore
            </Text>
            <Text style={{fontSize: 14}}>
              Restore your data from cloud storage
            </Text>
          </View>
        </Pressable>
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
    height: 220,
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

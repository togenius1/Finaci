import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {v4 as uuidv4} from 'uuid';

// import {EXPENSES} from '../dummy/dummy';
import {useAppDispatch, useAppSelector} from '../hooks';
import {accountActions} from '../store/account-slice';
import {sumTotalBudget, sumTotalFunc} from '../util/math';
import {AccountNavigationType} from '../types';
import AddAccountForm from '../components/Form/AddAccountForm';
import {AccountType, CashType} from '../models/account';
import {ExpenseType} from '../models/expense';
import {currencyFormatter} from '../util/currencyFormatter';
import {fetchExpensesData} from '../store/expense-action';
import {fetchAccountsData} from '../store/account-action';
import {fetchCashAccountsData} from '../store/cash-action';
import {cashAccountsActions} from '../store/cash-slice';
import {isEmpty} from '@aws-amplify/core';
// import { AccountCategory, CashCategory } from '../dummy/account';

type Props = {
  navigation: AccountNavigationType;
};

const {width} = Dimensions.get('window');

// const colors = {
//   cash: 'blue',
//   account: 'red',
// };

const AccountsScreen = ({navigation}: Props) => {
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const expenseData = dataLoaded?.expenses?.expenses;
  const cashData = dataLoaded?.cashAccounts?.cashAccounts;
  const accountsData = dataLoaded?.accounts?.accounts;

  // const [expenseData, setExpenseData] = useState<ExpenseType>();
  // const [cashData, setCashData] = useState<CashType>();
  // const [accountData, setAccountData] = useState<AccountType>();
  const [addAccountPressed, setAddAccountPressed] = useState<boolean>(false);
  const [accountText, setAccountText] = useState<string | null>('');
  const [budget, setBudget] = useState<number>(0);
  const [selectedCash, setSelectedCash] = useState<boolean>(true);

  // Set accountText and budget to Storage, after add account.
  // Update account details

  // useEffect(() => {
  // dispatch(fetchExpensesData());
  // dispatch(fetchAccountsData());
  // dispatch(fetchCashAccountsData());
  // }, []);

  const cashBudget = sumTotalBudget(cashData)?.toFixed(2);
  const accountsBudget = sumTotalBudget(accountsData)?.toFixed(2);
  const totalAssets = +cashBudget + +accountsBudget;
  const totalExpenses = sumTotalFunc(expenseData)?.toFixed(2);
  const total = totalAssets - +totalExpenses;

  function onAccountsHandler(item) {
    navigation.navigate('AccountsItem', {
      account: item.title,
      accountId: item.id,
    });
  }

  function addAccountHandler() {
    setAddAccountPressed(pressed => !pressed);
  }

  function closeFormHandler() {
    setAddAccountPressed(false);
  }

  function saveFormHandler() {
    if (selectedCash) {
      const cashId = 'cash-' + uuidv4();
      // Create new Cash Account
      if (cashData?.length === 0) {
        dispatch(
          cashAccountsActions.addCashAccount({
            id: cashId,
            budget: budget,
            date: new Date(),
          }),
        );
      } else {
        // Update Cash Account
        dispatch(
          cashAccountsActions.updateCashAccount({
            id: cashData[0]?.id,
            budget: +cashData[0]?.budget + +budget,
            date: new Date(),
          }),
        );
      }
    } else {
      //
      const accId = 'cash-' + uuidv4();
      const findAccTitle = accountsData?.findIndex(
        acc => acc?.title === accountText,
      );
      // dispatch account
      if (accountsData?.length === 0 || findAccTitle === -1) {
        dispatch(
          accountActions.addAccount({
            id: accId,
            title: accountText,
            budget: budget,
            date: new Date(),
            removable: true,
          }),
        );
      } else {
        Alert.alert('Account Warning', 'The account is in the list already.');
      }
    }

    setAddAccountPressed(false);
  }

  const removeAccountHandler = accountId => {
    const findAcc = accountsData?.filter(acc => acc?.id === accountId);

    console.log(findAcc);
    console.log(findAcc[0]?.removable);

    if (findAcc?.length > 0 && findAcc[0]?.removable === true) {
      dispatch(
        accountActions.deleteAccount({
          accountId,
        }),
      );
    } else {
      Alert.alert('Account Warning!', 'The account cannot be removed.');
    }
  };

  const renderItem = ({item}) => {
    const accBalance = +item.budget - +totalExpenses;

    return (
      <View>
        <Pressable
          key={item}
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => onAccountsHandler(item)}
          onLongPress={() =>
            Alert.alert(
              'Do you want to remove this account?',
              'You can add new accounts after remove it.',
              [
                {
                  text: 'Yes',
                  onPress: () => removeAccountHandler(item?.id),
                },
                {
                  text: 'No',
                  // onPress: () => console.log('No'),
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
            )
          }>
          <View style={styles.item}>
            <View>
              <Text style={{fontSize: 16}}>{item.title}</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'blue'}}>
                {currencyFormatter(+accBalance, {})}
              </Text>
              <Text style={{fontSize: 11, marginTop: 10}}>
                ({currencyFormatter(+item.budget, {})} budget)
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.assetsContainer}>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Assets</Text>
          <Text style={[styles.headerValueText, {color: 'blue'}]}>
            {currencyFormatter(+totalAssets, {})}
          </Text>
        </View>

        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Liabilities</Text>
          <Text style={[styles.headerValueText, {color: 'red'}]}>
            {currencyFormatter(+totalExpenses, {})}
          </Text>
        </View>

        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Total</Text>
          <Text style={styles.headerValueText}>
            {currencyFormatter(+total, {})}
          </Text>
        </View>
      </View>

      <View style={styles.accountsContainer}>
        <View>
          <Text style={styles.accountTitle}>Cash</Text>
          <FlatList
            keyExtractor={item => item.id + uuidv4()}
            data={cashData}
            renderItem={renderItem}
            bounces={false}
          />
        </View>

        <View style={styles.accountsContainer}>
          <Text style={styles.accountTitle}>Accounts</Text>
          <FlatList
            keyExtractor={item => item.id + uuidv4()}
            data={accountsData}
            renderItem={renderItem}
            bounces={false}
          />
        </View>
      </View>

      <View style={styles.addButton}>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => addAccountHandler()}>
          <View style={{marginRight: 10, marginBottom: 15}}>
            <Ionicons name="add-circle" size={80} color="#3683e2" />
          </View>
        </Pressable>
      </View>

      {addAccountPressed && (
        <AddAccountForm
          selectedCash={selectedCash}
          setSelectedCash={setSelectedCash}
          closeFormHandler={closeFormHandler}
          saveFormHandler={saveFormHandler}
          setAccountText={setAccountText}
          accountText={accountText}
          setBudget={setBudget}
          budget={budget}
        />
      )}
    </View>
  );
};

export default AccountsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  assetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  item: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderColor: 'lightgrey',
    borderWidth: 0.5,
  },
  accountsContainer: {
    flex: 1,
    marginTop: 20,
  },
  headerBox: {
    // backgroundColor: 'red',
    width: (width * 0.8) / 4,
    alignSelf: 'center',
  },
  headerText: {
    alignSelf: 'center',
    fontSize: 14,
  },
  headerValueText: {
    alignSelf: 'center',
    fontSize: 15,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  accounts: {
    marginBottom: 50,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: width * 0.8,
    marginBottom: 30,
    marginLeft: 60,
    // backgroundColor: 'red',
  },
  pressed: {
    opacity: 0.65,
  },
});

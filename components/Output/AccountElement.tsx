import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {v4 as uuidv4} from 'uuid';

import {currencyFormatter} from '../../util/currencyFormatter';
import {accountActions} from '../../store/account-slice';
import {useAppDispatch, useAppSelector} from '../../hooks';
import AccountHeader from '../AccountHeader';
import {sumTotalFunc} from '../../util/math';
import {cashAccountsActions} from '../../store/cash-slice';

const {width, height} = Dimensions.get('window');

const AccountElement = ({
  setIsModalVisible,
  setAccountText,
  setAddAccPressed,
  setBudget,
  setIsEditAccount,
  cashData,
  accountsData,
  sortedItems,
  cashBudget,
  accountsBudget,
  totalExpenses,
  onPress,
}: Props) => {
  const dispatch = useAppDispatch();

  // const dispatch = useAppDispatch();
  const expensesData = useAppSelector(
    state => state.expenses.expenses,
    // shallowEqual,
  );

  const totalAssets = Number(cashBudget) + Number(accountsBudget);
  const total = totalAssets - Number(totalExpenses);

  const editAccountPressedHandler = (accId: string) => {
    const findAcc = accountsData?.filter(acc => acc?.id === accId);

    setIsModalVisible(true);
    setIsEditAccount(true);
    setAddAccPressed(true);
    setAccountText(findAcc[0]?.title);
    setBudget(findAcc[0]?.budget);
  };

  const removeAccountHandler = (accountId: string) => {
    const id = accountId?.split('-');
    if (id[0] === 'cash') {
      dispatch(
        cashAccountsActions.deleteCashAccount({
          accountId,
        }),
      );
    } else {
      dispatch(
        accountActions.deleteAccount({
          accountId,
        }),
      );
    }
  };

  const renderItem = ({item}) => {
    // Account expense
    const expenseOfCash = expensesData?.filter(
      expense => expense?.accountId === item?.id,
    );

    const totalExpenseByCash = sumTotalFunc(expenseOfCash);

    const accBalance = +item.budget - Number(totalExpenseByCash);

    // if (item.id === 'cash1') {
    //   accBalance = +item.budget - Number(totalExpenseByCash);
    //   // console.log(item.budget);
    // }

    if (+item.budget === 0) return;

    return (
      <View>
        <Pressable
          key={item}
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => onPress(item)}
          onLongPress={() =>
            Alert.alert(
              'Edit or Delete?',
              'You can Edit or remove the account.',
              [
                {
                  text: 'Edit',
                  onPress: () => editAccountPressedHandler(item?.id),
                  // style: 'cancel',
                },
                {
                  text: 'Delete',
                  onPress: () => removeAccountHandler(item?.id),
                },
                {
                  text: 'Cancel',
                  // onPress: () => editAccountPressedHandler(item?.id),
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
      <AccountHeader
        totalAssets={totalAssets}
        totalExpenses={totalExpenses}
        total={total}
      />

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
            data={sortedItems}
            renderItem={renderItem}
            bounces={false}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width,
    height: height * 0.55,
    marginTop: 20,
    // backgroundColor: 'red',
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 5,
  },
  pressed: {
    opacity: 0.65,
  },
});

export default AccountElement;

// ========================= TYPE ========================================
type Props = {
  setIsModalVisible: (value: boolean) => void;
  setAccountText: (value: string) => void;
  setAddAccPressed: (value: boolean) => void;
  setBudget: (value: number) => void;
  setIsEditAccount: (value: boolean) => void;
  setRemoveAccount: (value: boolean) => void;
  cashData: any[];
  accountsData: any[];
  sortedItems: any[];
  cashBudget: number | undefined;
  accountsBudget: number | undefined;
  totalExpenses: number | undefined;
  onPress: () => void;
};

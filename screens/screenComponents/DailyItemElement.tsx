import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {fetchCashAccountsData} from '../../store/cash-action';
import {fetchAccountsData} from '../../store/account-action';
import {fetchExpensesData} from '../../store/expense-action';
import {fetchIncomesData} from '../../store/income-action';
import {accountActions} from '../../store/account-slice';
import {expenseActions} from '../../store/expense-slice';
import {dailyTransaction} from '../../util/transaction';
import {dailyTransactsActions} from '../../store/dailyTransact-slice';
import {incomeActions} from '../../store/income-slice';

// import {DailyItemType} from '../../components/Output/TransactionSummary';

type Props = {};

const {width, height} = Dimensions.get('window');

const DailyItemElement = ({
  type,
  amount,
  day,
  dayLabel,
  monthLabel,
  year,
  time,
  accountId,
  cateId,
  itemId,
}: Props) => {
  if (day < 10) {
    day = `0${day}`;
  }

  // Get Category name in Storage
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const ExpensesCate = dataLoaded?.expenseCategories?.expenseCategories;
  const IncomesCate = dataLoaded?.incomeCategories?.incomeCategories;
  const Accounts = dataLoaded?.accounts?.accounts;
  const Cash = dataLoaded?.cashAccounts?.cashAccounts;

  const Expenses = dataLoaded?.expenses?.expenses;
  const Incomes = dataLoaded?.incomes?.incomes;
  const DailyTransactionsData = dataLoaded?.dailyTransacts?.dailyTransacts;

  const filteredExpenses = ExpensesCate.filter(exp => exp.id === cateId);
  const filteredIncomes = IncomesCate.filter(income => income.id === cateId);

  let filteredAccounts;
  if (accountId === 'cash1') {
    filteredAccounts = Cash.filter(acc => acc.id === accountId);
  } else {
    filteredAccounts = Accounts.filter(acc => acc.id === accountId);
  }

  const removeExpenseHandler = (expenseId: string) => {
    dispatch(
      expenseActions.deleteExpense({
        expenseId,
      }),
    );
    // Update Daily Transaction
    const filteredExpense = Expenses?.filter(exp => exp?.id === expenseId);
    const filteredDailyTransactions = DailyTransactionsData?.filter(
      tran => `0${tran.day}` === day,
    );
    dispatch(
      dailyTransactsActions.updateDailyTransacts({
        id: filteredDailyTransactions[0]?.id,
        date: filteredDailyTransactions[0]?.date,
        day: filteredDailyTransactions[0]?.day,
        expense_daily:
          +filteredDailyTransactions[0]?.expense_daily -
          +filteredExpense[0].amount,
        income_daily: filteredDailyTransactions[0]?.income_daily,
      }),
    );

    // Update Weekly Transaction
    // Update Monthly Transaction
  };

  const removeIncomeHandler = (incomeId: string) => {
    dispatch(
      incomeActions.deleteIncome({
        incomeId,
      }),
    );
    // Update Daily Transaction
    const filteredIncome = Incomes?.filter(income => income?.id === incomeId);
    const filteredDailyTransactions = DailyTransactionsData?.filter(
      tran => `0${tran.day}` === day,
    );

    console.log(filteredDailyTransactions);
    dispatch(
      dailyTransactsActions.updateDailyTransacts({
        id: filteredDailyTransactions[0]?.id,
        date: filteredDailyTransactions[0]?.date,
        day: filteredDailyTransactions[0]?.day,
        expense_daily: +filteredDailyTransactions[0]?.expense_daily,
        income_daily:
          +filteredDailyTransactions[0]?.income_daily -
          +filteredIncome[0].amount,
      }),
    );
     // Update Weekly Transaction
    // Update Monthly Transaction
  };

  return (
    <View style={styles.list}>
      {type === 'income' && (
        <>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            // onPress={() => navigation.navigate('IncomesDetails')}
            onLongPress={() =>
              Alert.alert(
                'Edit or Delete?',
                'You can Edit or remove the account.',
                [
                  {
                    text: 'Edit',
                    onPress: () => console.log('Edit'),
                    // style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: () => removeIncomeHandler(itemId),
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
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: width / 4,
                marginRight: 10,
                // backgroundColor: '#e1f3cd',
              }}>
              <Text style={{fontSize: 14, color: 'blue'}}>{amount}</Text>
            </View>
          </Pressable>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: width / 3.5,
              marginRight: 40,
              // backgroundColor: '#f5bebe',
            }}>
            <Text style={{fontSize: width * 0.045, color: 'black'}}>
              {filteredIncomes[0]?.title}
            </Text>
            <Text style={{fontSize: 10, color: 'grey'}}>
              acc.{filteredAccounts[0]?.title}
            </Text>
          </View>
        </>
      )}

      {type === 'expense' && (
        <>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            // onPress={() => navigation.navigate('ExpensesDetails')}
            onLongPress={() =>
              Alert.alert(
                'Edit or Delete?',
                'You can Edit or remove the account.',
                [
                  {
                    text: 'Edit',
                    onPress: () => console.log('Edit'),
                    // style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: () => removeExpenseHandler(itemId),
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
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: width / 4,
                marginRight: 20,
                // backgroundColor: '#f5bebe',
              }}>
              <Text style={{fontSize: width * 0.045, color: 'red'}}>
                {amount}
              </Text>
            </View>
          </Pressable>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: width / 3.5,
              marginRight: 40,
              // backgroundColor: '#f5bebe',
            }}>
            <Text style={{fontSize: width * 0.035, color: 'black'}}>
              {filteredExpenses[0]?.title}
            </Text>
            <Text style={{fontSize: 10, color: 'grey'}}>
              acc.{filteredAccounts[0]?.title}
            </Text>
          </View>
        </>
      )}

      <View style={styles.dateContainer}>
        <View style={styles.dateLabel}>
          <Text style={{fontSize: 12, color: 'white'}}>{dayLabel}</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: width * 0.03, color: 'grey'}}>{day} </Text>
            <Text style={{fontSize: 12, color: 'grey'}}>{monthLabel} </Text>
            <Text style={{fontSize: 12, color: 'grey'}}>{year}</Text>
          </View>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

export default DailyItemElement;

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: 20,
    marginLeft: 0,
    marginRight: 0,
    marginVertical: 5,
    backgroundColor: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    width: 110,
    marginRight: 2,
    marginTop: 5,
    // backgroundColor: '#ffeeee',
  },
  dateLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6f6f6f',
    width: 30,
    height: 20,
    marginRight: 5,
    borderWidth: 0.5,
    borderColor: '#black',
  },
  time: {
    marginTop: 5,
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#000000',
  },
  pressed: {
    opacity: 0.65,
  },
});

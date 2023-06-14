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
import {expenseActions} from '../../store/expense-slice';
// import {dailyTransaction} from '../../util/transaction';
import {dailyTransactsActions} from '../../store/dailyTransact-slice';
import {incomeActions} from '../../store/income-slice';
// import {weekTransactions} from '../../dummy/transactions/weeklyTransact';
import {getWeekInMonth} from '../../util/date';
import moment from 'moment';
import {weeklyTransactsActions} from '../../store/weeklyTransact-slice';
import {monthlyTransactsActions} from '../../store/monthlyTransact-slice';

// import {DailyItemType} from '../../components/Output/TransactionSummary';

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
  if (Number(day) < 10) {
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
  const WeeklyTransactionsData = dataLoaded?.weeklyTransacts?.weeklyTransacts;
  const MonthlyTransactionsData =
    dataLoaded?.monthlyTransacts?.monthlyTransacts;

  const filteredExpensesCat = ExpensesCate.filter(exp => exp.id === cateId);
  const filteredIncomesCat = IncomesCate.filter(income => income.id === cateId);

  const filteredExpenses = Expenses?.filter(exp => exp.id === itemId);
  const filteredIncomes = Incomes?.filter(income => income.id === itemId);

  console.log('note: ', filteredIncomes[0]?.note);

  let filteredAccounts;

  if (accountId === undefined) {
    accountId = 'cash';
  }
  const id = accountId?.split('-');

  if (id[0] === 'cash') {
    filteredAccounts = Cash.filter(acc => acc.id === accountId);
  } else {
    filteredAccounts = Accounts.filter(acc => acc.id === accountId);
  }

  const removeIncomeHandler = (incomeId: string) => {
    // Update Daily Transaction
    updateDailyTransactsHandler(incomeId, 'income');
    // Update Weekly Transaction
    updateWeeklyTransactionsHandler(incomeId, 'income');
    // Update Monthly Transaction
    updateMonthlyTransactionsHandler(incomeId, 'income');

    // Remove Income
    dispatch(
      incomeActions.deleteIncome({
        incomeId,
      }),
    );
  };

  const removeExpenseHandler = (expenseId: string) => {
    // Update Daily Transaction
    updateDailyTransactsHandler(expenseId, 'expense');
    // Update Weekly Transaction
    updateWeeklyTransactionsHandler(expenseId, 'expense');
    // Update Monthly Transaction
    updateMonthlyTransactionsHandler(expenseId, 'expense');

    // Remove Expense
    dispatch(
      expenseActions.deleteExpense({
        expenseId,
      }),
    );
  };

  const updateDailyTransactsHandler = (itemId: string, type: string) => {
    let deletedObj;
    if (type === 'expense') {
      deletedObj = Expenses?.filter(exp => exp?.id === itemId);
    }
    if (type === 'income') {
      deletedObj = Incomes?.filter(income => income?.id === itemId);
    }

    const filteredDailyTransactions = DailyTransactionsData?.filter(
      tran => +tran.day === +day,
    );

    dispatch(
      dailyTransactsActions.updateDailyTransacts({
        id: filteredDailyTransactions[0]?.id,
        date: filteredDailyTransactions[0]?.date,
        day: filteredDailyTransactions[0]?.day,
        expense_daily:
          type === 'expense'
            ? +filteredDailyTransactions[0]?.expense_daily -
              +deletedObj[0]?.amount
            : filteredDailyTransactions[0]?.expense_daily,
        income_daily:
          type === 'income'
            ? +filteredDailyTransactions[0]?.income_daily -
              +deletedObj[0]?.amount
            : filteredDailyTransactions[0]?.income_daily,
      }),
    );
  };

  const updateWeeklyTransactionsHandler = (itemId: string, type: string) => {
    const month = moment().month(monthLabel).format('M');
    const week = getWeekInMonth(year, month, day);
    let deletedObj;
    if (type === 'expense') {
      deletedObj = Expenses?.filter(exp => exp?.id === itemId);
    }
    if (type === 'income') {
      deletedObj = Incomes?.filter(income => income?.id === itemId);
    }
    const filteredWeeklyTransactions = WeeklyTransactionsData?.filter(
      tran => +tran.week === +week,
    );

    dispatch(
      weeklyTransactsActions.updateWeeklyTransacts({
        id: filteredWeeklyTransactions[0]?.id,
        date: filteredWeeklyTransactions[0]?.date,
        week: filteredWeeklyTransactions[0]?.week,
        expense_weekly:
          type === 'expense'
            ? +filteredWeeklyTransactions[0]?.expense_weekly -
              +deletedObj[0]?.amount
            : filteredWeeklyTransactions[0]?.expense_weekly,
        income_weekly:
          type === 'income'
            ? +filteredWeeklyTransactions[0]?.income_weekly -
              +deletedObj[0]?.amount
            : filteredWeeklyTransactions[0]?.income_weekly,
      }),
    );
  };

  // Update Monthly transactions
  const updateMonthlyTransactionsHandler = (itemId, type) => {
    const month = moment().month(monthLabel).format('M');
    // const week = getWeekInMonth(year, month, day);
    let deletedObj;
    if (type === 'expense') {
      deletedObj = Expenses?.filter(exp => exp?.id === itemId);
    }
    if (type === 'income') {
      deletedObj = Incomes?.filter(income => income?.id === itemId);
    }
    const filteredMonthlyTransactions = MonthlyTransactionsData?.filter(
      tran => +tran.month === +month,
    );
    dispatch(
      monthlyTransactsActions.updateMonthlyTransactions({
        id: filteredMonthlyTransactions[0]?.id,
        date: filteredMonthlyTransactions[0]?.date,
        month: filteredMonthlyTransactions[0]?.month,
        expense_monthly:
          type === 'expense'
            ? +filteredMonthlyTransactions[0]?.expense_monthly -
              +deletedObj[0]?.amount
            : filteredMonthlyTransactions[0]?.expense_monthly,
        income_monthly:
          type === 'income'
            ? +filteredMonthlyTransactions[0]?.income_monthly -
              +deletedObj[0]?.amount
            : filteredMonthlyTransactions[0]?.income_monthly,
      }),
    );
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
          <View style={styles.amount}>
            <Text style={{fontSize: width * 0.045, color: 'black'}}>
              {filteredIncomesCat[0]?.title}
            </Text>
            <Text style={{fontSize: 10, color: 'grey'}}>
              acc.{filteredAccounts[0]?.title}
            </Text>
            <View>
              <Text>note: {filteredIncomes[0]?.note}</Text>
            </View>
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
            <View style={styles.amount}>
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
              {filteredExpensesCat[0]?.title}
            </Text>
            <Text style={{fontSize: 10, color: 'grey'}}>
              acc.{filteredAccounts[0]?.title}
            </Text>
            <View>
              <Text>note: {filteredExpenses[0]?.note}</Text>
            </View>
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

// Style
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
  amount: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: width / 4,
    // marginHorizontal: 20,
    // marginLeft:20,
    // backgroundColor: '#f5bebe',
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

//====================================== TYPE ======================================
type Props = {
  type: string | null;
  amount: number | undefined;
  day: string | null;
  dayLabel: string | null;
  monthLabel: string | null;
  year: number | undefined;
  time: string | null;
  accountId: string | null;
  cateId: string | null;
  itemId: string | null;
};

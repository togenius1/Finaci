import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import {isEmpty} from '@aws-amplify/core';

import {AddDetailsNavigationType, AddDetailsRouteProp} from '../types';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import {expenseActions} from '../store/expense-slice';
import {incomeActions} from '../store/income-slice';
import {useAppDispatch, useAppSelector} from '../hooks';
import Note from '../components/Menu/Note';
import Accounts from '../components/Menu/Accounts';
import Category from '../components/Form/Category';
import {sumByDate, sumByMonth, sumTransactionByWeek} from '../util/math';
import {monthlyTransactsActions} from '../store/monthlyTransact-slice';
import {getWeekInMonth} from '../util/date';
import {weeklyTransactsActions} from '../store/weeklyTransact-slice';
import {dailyTransactsActions} from '../store/dailyTransact-slice';
import {accountActions} from '../store/account-slice';
import {cashAccountsActions} from '../store/cash-slice';


const {width, height} = Dimensions.get('window');

const AddDetailsScreen = ({route, navigation}: Props) => {
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const expenses = dataLoaded?.expenses?.expenses;
  const incomes = dataLoaded?.incomes?.incomes;
  const AccountCategory = dataLoaded?.accounts?.accounts;
  const cash = dataLoaded?.cashAccounts?.cashAccounts;
  const ExpenseCategory = dataLoaded?.expenseCategories?.expenseCategories;
  const IncomeCategory = dataLoaded?.incomeCategories?.incomeCategories;
  const weeklyTransactsData = dataLoaded?.weeklyTransacts?.weeklyTransacts;

  const amount = route.params?.amount;
  const type = route.params?.transaction?.type;
  const categoryTitle = route.params?.transaction?.categoryTitle;
  const accountTitle = route.params?.transaction?.account;
  const d = route.params?.transaction?.date;
  const createdDate = moment(d).format('YYYY-MM-DD HH:mm:ss');

  const [textDate, setTextDate] = useState<string | null>(
    String(moment().format('YYYY-MM-DD HH:mm:ss')),
  );
  const [categoryPressed, setCategoryPressed] = useState<boolean>(false);
  const [category, setCategory] = useState();
  const [accountPressed, setAccountPressed] = useState<boolean>(false);
  const [account, setAccount] = useState();
  const [notePressed, setNotePressed] = useState<boolean>(false);
  const [note, setNote] = useState<Note>({
    note: '',
  });

  useEffect(() => {
    initialAccountHandler();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: type === 'expense' ? 'Expense' : 'Income',
      headerRight: () => (
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => saveHandler()}>
          <View style={styles.saveContainer}>
            <Text style={styles.save}>Save</Text>
          </View>
        </Pressable>
      ),
    });
  }, [navigation, amount, category, note, textDate, account]);

  // set initial date: from Calculator route or from Account route
  const initialDate =
    createdDate !== undefined
      ? moment(createdDate).format('YYYY-MM-DD HH:mm:ss')
      : textDate;

  const cashAccountCategoryById = cash?.find(cash => cash.id === account?.id);
  const accountCategoryById = AccountCategory?.find(
    acc => acc.id === account?.id,
  );
  const expenseCategoryById = ExpenseCategory?.find(
    cate => cate?.id === category?.id,
  );
  const incomeCategoryById = IncomeCategory?.find(
    cate => cate.id === category?.id,
  );

  // Cash or other accounts
  const selectedAccountId =
    account?.title === 'Cash'
      ? cashAccountCategoryById?.id
      : accountCategoryById?.id;

  // Initial account
  const initialAccountHandler = () => {
    const SelectedTitle =
      account?.title === undefined ? 'Cash' : account?.title;
    if (isEmpty(cash) || +cash[0]?.budget === 0) {
      const accId = 'cash-' + uuidv4();
      dispatch(
        cashAccountsActions.addCashAccount({
          id: accId,
          title: SelectedTitle,
          budget: 10000,
          date: new Date(),
          editedDate: new Date(),
        }),
      );
    }
    const initialAccount = cash[0];
    setAccount(initialAccount);
  };

  // Save data to Storage Func
  const saveDataToStorage = async () => {
    if (type === 'expense') {
      dispatch(
        expenseActions.addExpense({
          id: 'expense-' + uuidv4(),
          accountId: selectedAccountId,
          cateId: expenseCategoryById?.id,
          amount: amount,
          note: note.note,
          date: textDate,
        }),
      );
    }
    if (type === 'income') {
      dispatch(
        incomeActions.addIncome({
          id: 'income-' + uuidv4(),
          accountId: selectedAccountId,
          cateId: incomeCategoryById?.id,
          amount: amount,
          note: note.note,
          date: textDate,
        }),
      );
    }
  };
  //

  // Save Function
  const saveHandler = async () => {
    //save
    await saveDataToStorage();

    // Update Accounts
    accountsBudgetUpdate();

    //Update Transactions
    monthlyTransactionsUpdate();
    weeklyTransactionsUpdate();
    dailyTransactionsUpdate();
    navigation.navigate('Overview');
  };

  // Update Account budget
  const accountsBudgetUpdate = () => {
    if (type === 'expense') return;
    // if (type === 'income') {
    if (account?.title !== 'Cash') {
      const prevAcc = AccountCategory.filter(
        account => account?.id === selectedAccountId,
      );
      dispatch(
        accountActions.updateAccount({
          id: selectedAccountId,
          title: account?.title,
          budget: +prevAcc[0]?.budget + +amount,
          date: textDate,
        }),
      );
    } else {
      const prevCash = cash.filter(cash => cash?.id === selectedAccountId);
      dispatch(
        cashAccountsActions.updateCashAccount({
          id: selectedAccountId,
          title: account?.title,
          budget: +prevCash[0]?.budget + +amount,
          date: textDate,
        }),
      );
    }
    // }
  };

  //Update Monthly Transaction
  const monthlyTransactionsUpdate = () => {
    const month = moment(textDate).month() + 1;

    if (type === 'expense') {
      // Previous monthly transactions values
      const expenseMonthly =
        sumByMonth(expenses, 'expense')?.filter(
          expense => expense?.month === month,
        )[0]?.amount + amount;

      const incomeMonthly = sumByMonth(incomes, 'income')?.filter(
        income => income?.month === month,
      )[0]?.amount;

      const income_monthly = incomeMonthly === undefined ? 0 : incomeMonthly;

      dispatchMonthlyTransactionsToStorage(
        +expenseMonthly,
        income_monthly,
        month,
      );
    }
    if (type === 'income') {
      const expenseMonthly = sumByMonth(expenses, 'expense')?.filter(
        expense => expense?.month === month,
      )[0]?.amount;
      const incomeMonthly =
        sumByMonth(incomes, 'income')?.filter(
          income => income?.month === month,
        )[0]?.amount + amount;

      const expense_monthly = expenseMonthly === undefined ? 0 : expenseMonthly;

      dispatchMonthlyTransactionsToStorage(
        expense_monthly,
        +incomeMonthly,
        month,
      );
    }
  };

  // Update Weekly Transaction
  const weeklyTransactionsUpdate = async () => {
    const year = moment(textDate).year();
    const month = moment(textDate).month() + 1;
    const day = moment(textDate).date();
    const currentWeek = getWeekInMonth(year, month, day);

    const weeklyTransactions = sumTransactionByWeek([incomes, expenses]);

    const filteredWeeklyTransactions = weeklyTransactions?.filter(
      wt =>
        (+wt.expense_weekly !== 0 || +wt.income_weekly !== 0) &&
        moment(wt.date).year() === year &&
        +moment(wt.date).month() + 1 === month &&
        +wt.week === +currentWeek,
    );

    if (type === 'expense') {
      // Previous monthly transactions values
      const expenseWeekly =
        filteredWeeklyTransactions[0]?.expense_weekly === undefined
          ? amount
          : filteredWeeklyTransactions[0]?.expense_weekly + amount;

      const incomeWeekly =
        filteredWeeklyTransactions[0]?.income_weekly === undefined
          ? 0
          : filteredWeeklyTransactions[0]?.income_weekly;

      dispatchWeeklyTransactionsToStorage(
        +expenseWeekly,
        +incomeWeekly,
        currentWeek,
      );
    }
    if (type === 'income') {
      const expenseWeekly =
        filteredWeeklyTransactions[0]?.expense_weekly === undefined
          ? 0
          : filteredWeeklyTransactions[0]?.expense_weekly;

      const incomeWeekly =
        filteredWeeklyTransactions[0]?.income_weekly === undefined
          ? amount
          : filteredWeeklyTransactions[0]?.income_weekly + amount;

      dispatchWeeklyTransactionsToStorage(
        +expenseWeekly,
        +incomeWeekly,
        currentWeek,
      );
    }
  };

  // Update Daily Transaction
  const dailyTransactionsUpdate = () => {
    const date = moment(textDate).format('YYYY-MM-DD HH:mm:ss');
    const day = moment(textDate).date();

    if (type === 'expense') {
      const expenseDaily =
        sumByDate(expenses, 'expense', textDate).filter(
          expense => expense.day === day,
        )[0]?.amount + +amount;

      const incomeDaily = sumByDate(incomes, 'income', textDate)?.filter(
        income => income.day === day,
      )[0]?.amount;

      const income_daily = incomeDaily === undefined ? 0 : incomeDaily;

      dispatchDailyTransactionsToStorage(
        +expenseDaily,
        +income_daily,
        date,
        +day,
      );
    }

    if (type === 'income') {
      const expenseDaily = sumByDate(expenses, 'expense', textDate)?.filter(
        expense => expense?.day === day,
      )[0]?.amount;

      const incomeDaily =
        sumByDate(incomes, 'income', textDate)?.filter(
          income => income?.day === day,
        )[0]?.amount + +amount;

      const expense_daily = expenseDaily === undefined ? 0 : expenseDaily;

      dispatchDailyTransactionsToStorage(
        +expense_daily,
        +incomeDaily,
        date,
        +day,
      );
    }
  };

  // Dispatch monthly transactions
  const dispatchMonthlyTransactionsToStorage = (
    expenseAmount: number,
    incomeAmount: number,
    month: number,
  ) => {
    const transact_monthly = dataLoaded.monthlyTransacts?.monthlyTransacts;
    const findMonth = transact_monthly.filter(tr => Number(tr.month) === month);

    if (findMonth[0]?.month !== undefined) {
      dispatch(
        monthlyTransactsActions.updateMonthlyTransactions({
          id: 'monthlyTransaction-' + month,
          date: textDate,
          month: month,
          expense_monthly: expenseAmount,
          income_monthly: incomeAmount,
        }),
      );
    }
    if (findMonth[0]?.month === undefined) {
      dispatch(
        monthlyTransactsActions.addMonthlyTransactions({
          id: 'monthlyTransaction-' + month,
          date: textDate,
          month: month,
          expense_monthly: type === 'expense' ? amount : '',
          income_monthly: type === 'income' ? amount : '',
        }),
      );
    }
  };

  // Dispatch weekly transactions
  const dispatchWeeklyTransactionsToStorage = (
    expenseWeekly: number,
    incomeWeekly: number,
    week: number,
  ) => {
    const transact_weekly = dataLoaded?.weeklyTransacts?.weeklyTransacts;
    const findWeekT = transact_weekly?.filter(
      transact => Number(transact?.week) === week,
    );

    if (findWeekT[0]?.week !== undefined && findWeekT[0].week === week) {
      dispatch(
        weeklyTransactsActions.updateWeeklyTransacts({
          id: 'weeklyTransaction-' + week,
          date: textDate,
          week: week,
          expense_weekly: expenseWeekly,
          income_weekly: incomeWeekly,
        }),
      );
    }
    if (findWeekT[0]?.week === undefined) {
      dispatch(
        weeklyTransactsActions.addWeeklyTransacts({
          id: 'weeklyTransaction-' + week,
          date: textDate,
          week: week,
          expense_weekly: expenseWeekly,
          income_weekly: incomeWeekly,
        }),
      );
    }
  };

  // Dispatch daily transactions
  const dispatchDailyTransactionsToStorage = (
    expenseDaily: number,
    incomeDaily: number,
    date: string,
    day: number,
  ) => {
    const transact_daily = dataLoaded?.dailyTransacts?.dailyTransacts;
    const findDay = transact_daily?.filter(
      transact =>
        moment(transact?.date).format('YYYY-MM-DD') ===
        moment(date).format('YYYY-MM-DD'),
    );

    if (findDay?.length !== 0) {
      dispatch(
        dailyTransactsActions.updateDailyTransacts({
          id: uuidv4(),
          date: textDate,
          day: day,
          expense_daily: expenseDaily,
          income_daily: incomeDaily,
        }),
      );
    }
    if (findDay?.length === 0) {
      dispatch(
        dailyTransactsActions.addDailyTransacts({
          id: uuidv4(),
          date: textDate,
          day: day,
          expense_daily: expenseDaily,
          income_daily: incomeDaily,
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <ExpenseForm
        type={type}
        amount={amount}
        category={category}
        categoryTitle={categoryTitle}
        note={note.note}
        accountTitle={accountTitle}
        // createdDate={createdDate}
        account={account}
        textDate={textDate}
        setTextDate={setTextDate}
        setCategoryPressed={setCategoryPressed}
        setNotePressed={setNotePressed}
        setAccountPressed={setAccountPressed}
        initialDate={initialDate}
      />

      {categoryPressed && (
        <Category
          setCategoryPressed={setCategoryPressed}
          setCategory={setCategory}
          type={type}
        />
      )}

      {notePressed && (
        <Note setNotePressed={setNotePressed} setNote={setNote} note={note} />
      )}

      {accountPressed && (
        <Accounts
          setAccount={setAccount}
          setAccountPressed={setAccountPressed}
          month={+moment(textDate).month()}
          year={+moment(textDate).year()}
        />
      )}
    </View>
  );
};

export default AddDetailsScreen;


// Style
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    position: 'absolute',
    bottom: -height / 2,
    right: width / 8,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  currencyContainer: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#90b9ff',
    hadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,

    position: 'absolute',
    right: 15,
    top: 20,
  },
  currencyText: {
    fontSize: 16,
  },
  saveContainer: {
    position: 'absolute',
    right: 0,
    top: -10,
  },
  save: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.75,
  },
});

// ============================ TYPE =====================================
type Props = {
  navigation: AddDetailsNavigationType;
  route: AddDetailsRouteProp;
};

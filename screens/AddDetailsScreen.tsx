import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';

import {AddDetailsNavigationType, AddDetailsRouteProp} from '../types';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import {expenseActions} from '../store/expense-slice';
import {incomeActions} from '../store/income-slice';
import {useAppDispatch, useAppSelector} from '../hooks';
import Note from '../components/Menu/Note';
import Accounts from '../components/Menu/Accounts';
import Category from '../components/Menu/Category';
// import {
//   ExpenseCategory,
//   IncomeCategory,
//   TransferCategory,
// } from '../dummy/categoryItems';
// import {AccountCategory} from '../dummy/account';
import {CategoryType} from '../models/category';
import {fetchAccountsData} from '../store/account-action';
import {fetchExpenseCategoriesData} from '../store/expense-category-action';
import {fetchIncomeCategoriesData} from '../store/income-category-action';
// import {fetchTransferCategoriesData} from '../store/transfer-category-action';
import {sumByCustomMonth, sumByMonth} from '../util/math';
import {fetchCashAccountsData} from '../store/cash-action';
import {monthlyTransaction} from '../util/transaction';
import {monthlyTransactsActions} from '../store/monthlyTransact-slice';
import {fetchExpensesData} from '../store/expense-action';
import {fetchIncomesData} from '../store/income-action';
import {fetchDailyTransactsData} from '../store/dailyTransact-action';
import {fetchMonthlyTransactsData} from '../store/monthlyTransact-action';
import {fetchWeeklyTransactsData} from '../store/weeklyTransact-action';
import {Button} from 'react-native-share';
import CButton from '../components/UI/CButton';
import {isEmpty} from '@aws-amplify/core';
import {store} from '../store';

type Props = {
  navigation: AddDetailsNavigationType;
  route: AddDetailsRouteProp;
};

const {width, height} = Dimensions.get('window');

const AddDetailsScreen = ({route, navigation}: Props) => {
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const amount = route.params?.amount;
  const type = route.params?.transaction?.type;
  const categoryTitle = route.params?.transaction?.categoryTitle;
  const accountTitle = route.params?.transaction?.account;
  const d = route.params?.transaction?.date;
  const createdDate = moment(d).format('YYYY-MM-DD');

  const [textDate, setTextDate] = useState<string | null>(
    String(moment().format('YYYY-MM-DD')),
  );
  const [categoryPressed, setCategoryPressed] = useState<boolean>(false);
  const [category, setCategory] = useState();
  const [accountPressed, setAccountPressed] = useState<boolean>(false);
  const [account, setAccount] = useState();
  const [notePressed, setNotePressed] = useState<boolean>(false);
  const [note, setNote] = useState<Note>({
    note: '',
  });
  const [cateData, setCateData] = useState<CategoryType>();
  // const [date, setDate] = useState<string | null>();

  // set initial date: from Calculator route or from Account route
  const initialDate =
    createdDate !== undefined
      ? moment(createdDate).format('YYYY-MM-DD')
      : textDate;

  const expenses = dataLoaded?.expenses?.expenses;
  const incomes = dataLoaded?.incomes?.incomes;
  const AccountCategory = dataLoaded?.accounts?.accounts;
  const CashAccountCategory = dataLoaded?.cashAccounts?.cashAccounts;
  const ExpenseCategory = dataLoaded?.expenseCategories?.expenseCategories;
  const IncomeCategory = dataLoaded?.incomeCategories?.incomeCategories;
  // const TransferCategory = dataLoaded?.transferCategories?.transferCategories;

  const cashAccountCategoryById = CashAccountCategory.find(
    acc => acc.id === account?.id,
  );
  const accountCategoryById = AccountCategory.find(
    acc => acc.id === account?.id,
  );
  const expenseCategoryById = ExpenseCategory.find(
    cate => cate?.id === category?.id,
  );
  const incomeCategoryById = IncomeCategory.find(
    cate => cate.id === category?.id,
  );
  // const transferCategoryById = TransferCategory.find(
  //   tr => tr.id === category?.id,
  // );

  // Cash or other accounts
  const selectedAccount =
    account?.title === 'Cash'
      ? cashAccountCategoryById?.id
      : accountCategoryById?.id;

  // console.log('expenses -- ', expenses);
  // console.log('sumMonthly ', sumMonthly);

  // Provision categories should move from dummy to constant folder
  // to Load the existing categories
  useEffect(() => {
    dispatch(fetchAccountsData());
    dispatch(fetchCashAccountsData());
    dispatch(fetchExpenseCategoriesData());
    dispatch(fetchIncomeCategoriesData());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'Expenses',
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

  useEffect(() => {
    if (type === 'expense') {
      setCateData(ExpenseCategory);
    }
    if (type === 'income') {
      setCateData(IncomeCategory);
    }
    // if (type === 'transfer') {
    //   setCateData(TransferCategory);
    // }
  }, []);

  const saveHandler = () => {
    if (type === 'expense') {
      dispatch(
        expenseActions.addExpense({
          id: 'expense-' + uuidv4(),
          accountId: selectedAccount,
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
          accountId: selectedAccount,
          cateId: incomeCategoryById?.id,
          amount: amount,
          note: note.note,
          date: textDate,
        }),
      );
    }
    monthlyTransactionsUpdate();
    navigation.navigate('Overview');
  };

  // Clear data store.
  // useEffect(() => {
  //   dispatch(fetchExpensesData());
  //   dispatch(fetchIncomesData());
  //   dispatch(fetchMonthlyTransactsData());
  //   dispatch(fetchWeeklyTransactsData());
  //   dispatch(fetchDailyTransactsData());
  // }, []);

  // monthly transactions should be updated in background
  const monthlyTransactionsUpdate = () => {
    const month = moment(textDate).month() + 1;
    console.log('month ', month);

    if (type === 'expense') {
      // Previous monthly transactions values
      const expenseMonthly =
        sumByMonth(expenses, 'expense')?.filter(
          expense => expense?.month === month,
        )[0]?.amount + amount;
      const incomeMonthly = sumByMonth(incomes, 'income')?.filter(
        income => income?.month === month,
      )[0]?.amount;

      updateMonthlyTransactions(+expenseMonthly, incomeMonthly, String(month));
    }
    if (type === 'income') {
      const expenseMonthly = sumByMonth(expenses, 'expense')?.filter(
        expense => expense?.month === month,
      )[0]?.amount;
      const incomeMonthly =
        sumByMonth(incomes, 'income')?.filter(
          income => income?.month === month,
        )[0]?.amount + amount;

      updateMonthlyTransactions(expenseMonthly, +incomeMonthly, String(month));
    }
  };

  const updateMonthlyTransactions = (
    expenseAmount: number,
    incomeAmount: number,
    month: string,
  ) => {
    const transact_monthly = dataLoaded.monthlyTransacts?.monthlyTransacts;
    const findMonth = transact_monthly.filter(tr => String(tr.month) === month);

    console.log('transact_monthly: ', transact_monthly);
    console.log('findMonth: ', findMonth);
    console.log('month: ', findMonth[0]?.month);

    if (findMonth[0]?.month !== undefined) {
      console.log('expense is not null');
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
      console.log('expense is null');
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
          data={cateData}
        />
      )}

      {notePressed && (
        <Note setNotePressed={setNotePressed} setNote={setNote} note={note} />
      )}

      {accountPressed && (
        <Accounts
          setAccount={setAccount}
          setAccountPressed={setAccountPressed}
        />
      )}
    </View>
  );
};

export default AddDetailsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  amount: {
    // alignItems: 'flex-end',
    // backgroundColor: 'red',

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

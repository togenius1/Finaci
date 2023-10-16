import {
  // ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
// import {isEmpty} from '@aws-amplify/core';
// import {Auth} from 'aws-amplify';
// import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';

import {AddDetailsNavigationType, AddDetailsRouteProp} from '../types';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import {expenseActions} from '../store/expense-slice';
import {incomeActions} from '../store/income-slice';
import {useAppDispatch, useAppSelector} from '../hooks';
import Note from '../components/Menu/Note';
import Accounts from '../components/Menu/Accounts';
import Category from '../components/Form/Category';
import {
  sumByDate,
  sumByMonth,
  // sumTotalFunc,
  sumTransactionByWeek,
} from '../util/math';
import {monthlyTransactsActions} from '../store/monthlyTransact-slice';
import {weeklyTransactsActions} from '../store/weeklyTransact-slice';
import {dailyTransactsActions} from '../store/dailyTransact-slice';
import {getWeekInMonth} from '../util/date';
import {accountActions} from '../store/account-slice';
import {cashAccountsActions} from '../store/cash-slice';
// import {totalIncomeActions} from '../store/yearlyTransact-slice';

const {width, height} = Dimensions.get('window');

// Ads variable
// const adUnitId = __DEV__
//   ? TestIds.INTERSTITIAL
//   : 'ca-app-pub-3212728042764573~3355076099';

const AddDetailsScreen = ({route, navigation}: Props) => {
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  // const customerInfosData = dataLoaded?.customerInfos?.customerInfos;

  const expenses = dataLoaded?.expenses?.expenses;
  const incomes = dataLoaded?.incomes?.incomes;
  const AccountCategory = dataLoaded?.accounts?.accounts;
  const cash = dataLoaded?.cashAccounts?.cashAccounts;
  const ExpenseCategory = dataLoaded?.expenseCategories?.expenseCategories;
  const IncomeCategory = dataLoaded?.incomeCategories?.incomeCategories;
  // const weeklyTransactsData = dataLoaded?.weeklyTransacts?.weeklyTransacts;

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
  const [category, setCategory] = useState<any[]>();
  const [accountPressed, setAccountPressed] = useState<boolean>(false);
  const [account, setAccount] = useState<any[]>();
  const [notePressed, setNotePressed] = useState<boolean>(false);
  const [note, setNote] = useState<Note>({
    note: '',
  });
  // const [showIndicator, setShowIndicator] = useState<boolean>(false);

  // const {isLoaded, isClosed, load, show} = useInterstitialAd(adUnitId, {
  //   requestNonPersonalizedAdsOnly: true,
  // });

  // // Load ads
  // useEffect(() => {
  //   // Start loading the interstitial straight away
  //   load();
  // }, [load]);

  // // Load ads again
  // useEffect(() => {
  //   if (isClosed) {
  //     // console.log('Reloading ad...');
  //     load();
  //   }
  // }, [isClosed]);

  useEffect(() => {
    initialAccountHandler();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: type === 'expense' ? 'Expense' : 'Income',
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          {/* <View style={{right: 55}}>
            <ActivityIndicator
              size="medium"
              color="#0000ff"
              animating={showIndicator}
            />
          </View> */}
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => saveHandler()}>
            <View style={styles.saveContainer}>
              <Text style={styles.save}>Save</Text>
            </View>
          </Pressable>
        </View>
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

  const selectedAccId =
    account?.title === 'Cash'
      ? cashAccountCategoryById?.id
      : accountCategoryById?.id;

  const selectedAccountId: string =
    String(selectedAccId) === 'undefined' ? 'Cash' : String(selectedAccId);

  // Initial account
  const initialAccountHandler = () => {
    const SelectedTitle =
      account?.title === undefined ? 'Cash' : account?.title;

    if (cash?.length === 0 || +cash[0]?.budget === 0) {
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
    // Ads
    // if (
    //   !filteredCustomerInfo[0]?.stdActive &&
    //   !filteredCustomerInfo[0]?.proActive
    // ) {
    //   // show Ads
    //   if (isLoaded) {
    //     show();
    //   }
    // }

    // Check Purchase user: show Ads
    // const authUser = await Auth.currentAuthenticatedUser();
    // const appUserId = authUser?.attributes?.sub;
    // const filteredCustomerInfo = customerInfosData?.filter(
    //   cus => cus.appUserId === appUserId,
    // );
    // setShowIndicator(true);
    //save
    await saveDataToStorage();

    // Update Accounts
    accountsBudgetUpdate();

    //Update Transactions
    monthlyTransactionsUpdate();
    weeklyTransactionsUpdate();
    dailyTransactionsUpdate();

    // setShowIndicator(false);

    navigation.navigate('Overview', {screen: 'Spending'});
  };

  // Update Account budget
  const accountsBudgetUpdate = () => {
    if (type === 'expense') return;

    if (account?.title !== 'Cash') {
      const prevAcc = AccountCategory?.filter(
        account => String(account?.id) === String(selectedAccountId),
      );

      dispatch(
        accountActions.updateAccount({
          id: selectedAccountId,
          title: account?.title,
          budget: +prevAcc[0]?.budget + +amount,
          date: textDate,
        }),
      );
    } else if (account?.title === 'Cash') {
      const prevCash = cash?.filter(
        cash => String(cash?.id) === String(selectedAccountId),
      );

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
    const year = moment(textDate).year();

    const transact_monthlyData = dataLoaded.monthlyTransacts?.monthlyTransacts;

    const findMonth = transact_monthlyData?.filter(
      tr =>
        Number(tr.year) === Number(year) && Number(tr.month) === Number(month),
    );

    // Filtered the same year expense
    const filteredExpenses = expenses?.filter(
      exp =>
        Number(moment(exp.date).year()) === Number(year) &&
        Number(moment(exp.date).month() + 1) === Number(month),
    );
    // Filtered the same year income
    const filteredIncomes = incomes?.filter(
      income =>
        Number(moment(income.date).year()) === Number(year) &&
        Number(moment(income.date).month() + 1) === Number(month),
    );

    if (type === 'expense') {
      let expenseMonthly: number;
      let income_monthly: number;

      if (findMonth?.length === 0) {
        expenseMonthly =
          sumByMonth(filteredExpenses, 'expense')?.filter(
            expense => expense?.month === month,
          )[0]?.amount + +amount;

        const incomeMonthly = sumByMonth(filteredIncomes, 'income')?.filter(
          income => income?.month === month,
        )[0]?.amount;
        income_monthly = incomeMonthly === undefined ? 0 : incomeMonthly;

        dispatchMonthlyTransactionsToStorage(
          +expenseMonthly,
          income_monthly,
          year,
          month,
          String(textDate),
          transact_monthlyData,
        );
      } else if (findMonth?.length > 0) {
        expenseMonthly = findMonth[0]?.expense_monthly + +amount;
        income_monthly = findMonth[0]?.income_monthly;

        dispatchMonthlyTransactionsToStorage(
          +expenseMonthly,
          income_monthly,
          year,
          month,
          String(textDate),
          transact_monthlyData,
        );
      }
    }
    // add income
    if (type === 'income') {
      let incomeMonthly: number;
      let expense_monthly: number;

      if (findMonth?.length === 0) {
        const expenseMonthly = sumByMonth(filteredExpenses, 'expense')?.filter(
          expense => expense?.month === month,
        )[0]?.amount;

        incomeMonthly =
          sumByMonth(filteredIncomes, 'income')?.filter(
            income => Number(income?.month) === Number(month),
          )[0]?.amount + +amount;

        expense_monthly = expenseMonthly === undefined ? 0 : expenseMonthly;

        dispatchMonthlyTransactionsToStorage(
          expense_monthly,
          +incomeMonthly,
          year,
          month,
          String(textDate),
          transact_monthlyData,
        );
      } else if (findMonth?.length > 0) {
        expense_monthly = findMonth[0]?.expense_monthly;
        incomeMonthly = findMonth[0]?.income_monthly + +amount;

        dispatchMonthlyTransactionsToStorage(
          expense_monthly,
          +incomeMonthly,
          year,
          month,
          String(textDate),
          transact_monthlyData,
        );
      }
    }
  };

  // Update Weekly Transaction
  const weeklyTransactionsUpdate = async () => {
    const year = moment(textDate).year();
    const month = moment(textDate).month() + 1;
    const day = moment(textDate).date();
    const currentWeek = getWeekInMonth(year, month, day);

    const transact_weeklyData = dataLoaded.weeklyTransacts?.weeklyTransacts;

    const findWeek = transact_weeklyData?.filter(
      tr =>
        Number(tr.year) === Number(year) &&
        Number(tr.month) === Number(month) &&
        Number(tr.week) === Number(currentWeek),
    );

    const filteredExpenses = expenses?.filter(
      expense =>
        Number(moment(expense.date).year()) === Number(year) &&
        Number(moment(expense.date).month() + 1) === Number(month),
    );
    const filteredIncomes = expenses?.filter(
      income =>
        Number(moment(income.date).year()) === Number(year) &&
        Number(moment(income.date).month() + 1) === Number(month),
    );

    let filteredWeeklyTransactions;

    if (findWeek?.length === 0) {
      const weeklyTransactions = sumTransactionByWeek([
        filteredIncomes,
        filteredExpenses,
      ]);
      // const weeklyTransactions = sumTransactionByWeek([incomes, expenses]);
      filteredWeeklyTransactions = weeklyTransactions?.filter(
        wt =>
          (+wt.expense_weekly !== 0 || +wt.income_weekly !== 0) &&
          Number(moment(wt.date).year()) === Number(year) &&
          Number(moment(wt.date).month() + 1) === Number(month) &&
          Number(wt.week) === Number(currentWeek),
      );
    } else if (findWeek?.length > 0) {
      filteredWeeklyTransactions = findWeek;
    }

    if (type === 'expense') {
      // Previous monthly transactions values
      const expenseWeekly =
        String(filteredWeeklyTransactions[0]?.expense_weekly) === 'undefined'
          ? +amount
          : +filteredWeeklyTransactions[0]?.expense_weekly + +amount;

      const incomeWeekly =
        String(filteredWeeklyTransactions[0]?.income_weekly) === 'undefined'
          ? 0
          : +filteredWeeklyTransactions[0]?.income_weekly;

      dispatchWeeklyTransactionsToStorage(
        +expenseWeekly,
        +incomeWeekly,
        year,
        month,
        currentWeek,
        transact_weeklyData,
      );
    }

    if (type === 'income') {
      const expenseWeekly =
        String(filteredWeeklyTransactions[0]?.expense_weekly) === 'undefined'
          ? 0
          : +filteredWeeklyTransactions[0]?.expense_weekly;

      const incomeWeekly =
        String(filteredWeeklyTransactions[0]?.income_weekly) === 'undefined'
          ? +amount
          : +filteredWeeklyTransactions[0]?.income_weekly + +amount;

      dispatchWeeklyTransactionsToStorage(
        +expenseWeekly,
        +incomeWeekly,
        year,
        month,
        currentWeek,
        transact_weeklyData,
      );
    }
  };

  // Update Daily Transaction
  const dailyTransactionsUpdate = () => {
    // const year = moment(textDate).year();
    // const month = moment(textDate).month() + 1;
    const date = moment(textDate).format('YYYY-MM-DD HH:mm:ss');
    const day = moment(textDate).date();

    const transact_dailyData = dataLoaded?.dailyTransacts?.dailyTransacts;
    const findDailyData = transact_dailyData?.filter(
      transact =>
        moment(transact?.date).format('YYYY-MM-DD') ===
          moment(date).format('YYYY-MM-DD') &&
        Number(transact?.day) === Number(day),
    );

    let expense_Daily;
    let income_Daily;

    if (findDailyData?.length === 0) {
      const filteredExpenses = expenses?.filter(
        expense =>
          moment(expense.date).format('YYYY-MM-DD') ===
          moment(date).format('YYYY-MM-DD'),
        // Number(moment(expense.date).year()) === Number(year) &&
        // Number(moment(expense.date).month() + 1) == Number(month),
      );

      const filteredIncomes = incomes?.filter(
        income =>
          moment(income.date).format('YYYY-MM-DD') ===
          moment(date).format('YYYY-MM-DD'),
        // Number(moment(income.date).year()) === Number(year) &&
        // Number(moment(income.date).month() + 1) === Number(month),
      );

      const expenseDaily = sumByDate(filteredExpenses, 'expense', textDate);
      const incomeDaily = sumByDate(filteredIncomes, 'income', textDate);

      expense_Daily = expenseDaily?.filter(
        expense =>
          moment(expense.date).format('YYYY-MM-DD') ===
            moment(date).format('YYYY-MM-DD') &&
          Number(expense.day) === Number(day),
      )[0]?.amount;

      income_Daily = incomeDaily?.filter(
        income =>
          moment(income.date).format('YYYY-MM-DD') ===
            moment(date).format('YYYY-MM-DD') &&
          Number(income.day) === Number(day),
      )[0]?.amount;
    } else if (findDailyData?.length > 0) {
      expense_Daily = findDailyData[0]?.expense_daily;
      income_Daily = findDailyData[0]?.income_daily;
    }

    if (type === 'expense') {
      expense_Daily = +expense_Daily + +amount;
      const income_daily =
        String(income_Daily) === 'undefined' ? 0 : +income_Daily;

      dispatchDailyTransactionsToStorage(
        +expense_Daily,
        +income_daily,
        date,
        +day,
        transact_dailyData,
      );
    }

    if (type === 'income') {
      income_Daily = Number(income_Daily) + +amount;

      const expense_daily =
        String(expense_Daily) === 'undefined' ? 0 : expense_Daily;

      dispatchDailyTransactionsToStorage(
        +expense_daily,
        +income_Daily,
        date,
        +day,
        transact_dailyData,
      );
    }
  };

  // Dispatch monthly transactions
  const dispatchMonthlyTransactionsToStorage = (
    expenseAmount: number,
    incomeAmount: number,
    year: number,
    month: number,
    date: string,
    transact_monthlyData: any[],
  ) => {
    // const transact_monthly = dataLoaded.monthlyTransacts?.monthlyTransacts;

    const findMonth = transact_monthlyData?.filter(
      tr => Number(tr.year) === year && Number(tr.month) === month,
    );

    if (findMonth.length > 0) {
      dispatch(
        monthlyTransactsActions.updateMonthlyTransactions({
          id: findMonth[0]?.id,
          date: date,
          year: findMonth[0]?.year,
          month: findMonth[0]?.month,
          expense_monthly: expenseAmount,
          income_monthly: incomeAmount,
        }),
      );
    }
    if (findMonth?.length === 0) {
      dispatch(
        monthlyTransactsActions.addMonthlyTransactions({
          id: 'monthlyTransaction-' + uuidv4(),
          date: date,
          year: year,
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
    year: number,
    month: number,
    week: number,
    transact_weeklyData: any[],
  ) => {
    // const transact_weekly = dataLoaded?.weeklyTransacts?.weeklyTransacts;
    const findWeekT = transact_weeklyData?.filter(
      transact =>
        Number(transact?.year) === year &&
        Number(transact?.month) === month &&
        Number(transact?.week) === week,
    );

    if (findWeekT?.length > 0) {
      dispatch(
        weeklyTransactsActions.updateWeeklyTransacts({
          id: findWeekT[0]?.id,
          date: textDate,
          year: findWeekT[0]?.year,
          month: findWeekT[0]?.month,
          week: findWeekT[0]?.week,
          expense_weekly: expenseWeekly,
          income_weekly: incomeWeekly,
        }),
      );
    }
    if (findWeekT?.length === 0) {
      dispatch(
        weeklyTransactsActions.addWeeklyTransacts({
          id: 'weeklyTransaction-' + uuidv4(),
          date: textDate,
          year: year,
          month: month,
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
    transact_dailyData: any[],
  ) => {
    // const transact_daily = dataLoaded?.dailyTransacts?.dailyTransacts;
    const findDay = transact_dailyData?.filter(
      transact =>
        moment(transact?.date).format('YYYY-MM-DD') ===
          moment(date).format('YYYY-MM-DD') && Number(transact?.day) === day,
    );

    if (findDay?.length > 0) {
      dispatch(
        dailyTransactsActions.updateDailyTransacts({
          id: findDay[0]?.id,
          date: findDay[0]?.date,
          day: findDay[0]?.day,
          expense_daily: expenseDaily,
          income_daily: incomeDaily,
        }),
      );
    }
    if (findDay?.length === 0) {
      dispatch(
        dailyTransactsActions.addDailyTransacts({
          id: 'dailyTransact-' + uuidv4(),
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
        textDate={String(textDate)}
        setTextDate={setTextDate}
        setCategoryPressed={setCategoryPressed}
        setNotePressed={setNotePressed}
        setAccountPressed={setAccountPressed}
        initialDate={String(initialDate)}
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
    color: '#027ac4',
    right: 5,
  },
  pressed: {
    opacity: 0.65,
  },
});

// ============================ TYPE =====================================
type Props = {
  navigation: AddDetailsNavigationType;
  route: AddDetailsRouteProp;
};

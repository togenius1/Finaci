import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

import {
  AccountCategory,
  CashCategory,
  ExpenseCategory,
  IncomeCategory,
} from '../dummy/categoryItems';
import {EXPENSES, INCOME} from '../dummy/dummy';
import {
  sortDataByDay,
  sumByCustomDate,
  sumByDate,
  sumTotalFunc,
} from '../util/math';
import MonthYearList from '../components/UI/Menu/MonthYearList';

type Props = {};

const {width} = Dimensions.get('window');

const initFromDate = `${moment().year()}-0${moment().month() + 1}-01`;
const initToDate = moment().format('YYYY-MM-DD');

function MenuHandler({monthlyClickedHandler, customClickedHandler}) {
  return (
    <View style={styles.listMenu}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => monthlyClickedHandler()}>
        <View
          style={{
            marginLeft: 10,
          }}>
          <Text>Monthly</Text>
        </View>
      </Pressable>

      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => {
          customClickedHandler();
        }}>
        <View
          style={{
            marginLeft: 10,
          }}>
          <Text>Custom</Text>
        </View>
      </Pressable>
    </View>
  );
}

function HeaderRightComponent({
  fromDate,
  toDate,
  showCustomDate,
  fromDateClickedHandler,
  toDateClickedHandler,
  rightMenuClickedHandler,
  showMonthYearListMenuHandler,
}) {
  const m = new Date(toDate).getMonth();
  const month = moment.monthsShort(m);
  const year = moment(toDate).year();
  return (
    <View style={styles.headerRightContainer}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => showMonthYearListMenuHandler()}>
        {!showCustomDate ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: '#ffd3d3',
              marginRight: 25,
            }}>
            <Text style={{fontSize: 16, color: '#2a8aff'}}>
              {month} {year}
            </Text>
          </View>
        ) : (
          ''
        )}
      </Pressable>

      {showCustomDate && (
        <>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              fromDateClickedHandler();
            }}>
            <View style={styles.customDate}>
              <Text style={styles.customDateText}>
                {moment(fromDate).format('YYYY-MM-DD')}
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              toDateClickedHandler();
            }}>
            <View style={styles.customDate}>
              <Text style={styles.customDateText}>
                {moment(toDate).format('YYYY-MM-DD')}
              </Text>
            </View>
          </Pressable>
        </>
      )}

      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => rightMenuClickedHandler()}>
        <View style={styles.headerRightMenu}>
          <Text style={styles.headerMenuText}>
            {showCustomDate ? 'Custom' : 'Monthly'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

function AccountsItem({navigation, route}: Props) {
  const [expensesData, setExpensesData] = useState();
  const [accountsData, setAccountsData] = useState();
  const [cashData, setCashData] = useState();
  const [incomesData, setIncomesData] = useState();
  const [mode, setMode] = useState('date');
  const [fromDate, setFromDate] = useState<string | null>(initFromDate);
  const [toDate, setToDate] = useState<string | null>(initToDate);
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState<number>(moment().month() + 1);
  const [showMonthYearListMenu, setShowMonthYearListMenu] =
    useState<boolean>(false);
  const [rightMenuClicked, setRightMenuClicked] = useState<boolean>(false);
  const [toDateClicked, setToDateClicked] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [fromDateClicked, setFromDateClicked] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);

  useEffect(() => {
    setExpensesData(EXPENSES);
    setIncomesData(INCOME);
    setAccountsData(AccountCategory);
    setCashData(CashCategory);
    onMonthYearSelectedHandler(moment().month());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: showCustomDate ? '' : route?.params?.account,
      headerRight: () => (
        <HeaderRightComponent
          fromDate={fromDate}
          toDate={toDate}
          showCustomDate={showCustomDate}
          fromDateClickedHandler={fromDateClickedHandler}
          toDateClickedHandler={toDateClickedHandler}
          rightMenuClickedHandler={rightMenuClickedHandler}
          showMonthYearListMenuHandler={showMonthYearListMenuHandler}
        />
      ),
    });
  }, [navigation, showCustomDate, fromDate, toDate]);

  if (
    expensesData === null ||
    expensesData === undefined ||
    incomesData === null ||
    incomesData === undefined ||
    accountsData === undefined ||
    accountsData === null ||
    cashData === undefined ||
    cashData === null
  ) {
    return <ActivityIndicator />;
  }

  // FILTERED DATA (From date ----> To date)
  const selectedDurationExpenseData = expensesData?.filter(
    expense =>
      new Date(expense.date) >= new Date(fromDate) &&
      new Date(expense.date) <= new Date(toDate),
  );
  const selectedDurationIncomeData = incomesData?.filter(
    income =>
      new Date(income.date) >= new Date(fromDate) &&
      new Date(income.date) <= new Date(toDate),
  );

  // Account
  const accountId = route?.params?.accountId;
  let accData = accountsData;
  if (route?.params?.account === 'Cash') {
    accData = cashData;
  }
  const account = accData?.filter(acc => acc?.id === accountId);
  // Account expense
  const expenseOfAccount = selectedDurationExpenseData?.filter(
    expense => expense?.accountId === accountId,
  );
  // Account income
  const incomeOfAccount = selectedDurationIncomeData?.filter(
    income => income?.accountId === accountId,
  );
  console.log(incomeOfAccount);
  // sum total
  const totalIncomeByAccount = sumTotalFunc(incomeOfAccount);
  const totalExpenseByAccount = sumTotalFunc(expenseOfAccount);
  const budget = +account[0]?.budget;
  const total = totalIncomeByAccount - totalExpenseByAccount;
  const balance = total + budget;

  // Combine expense and income data sum by custom
  const sumExpenseByCustomDate = sumByCustomDate(
    expenseOfAccount,
    'expense',
    fromDate,
    toDate,
  );
  const sumIncomeByCustomDate = sumByCustomDate(
    incomeOfAccount,
    'income',
    fromDate,
    toDate,
  );
  const data4 = [...sumExpenseByCustomDate, ...sumIncomeByCustomDate];
  let customData = Object.values(
    data4.reduce((acc, cur) => {
      if (!acc[cur?.day])
        acc[cur?.day] = {Day: cur?.day, Date: cur?.date, Products: []};
      acc[cur?.day].Products.push(cur);
      return acc;
    }, {}),
  );
  const filteredCustomData = customData?.filter(
    data => data?.Products[0]?.amount !== 0 || data?.Products[1]?.amount !== 0,
  );

  filteredCustomData?.sort((a: any, b: any) => {
    const dateA = new Date(a.Date);
    const dateB = new Date(b.Date);
    if (dateA < dateB) {
      return -1; // return -1 here for DESC order
    }
    return 1; // return 1 here for DESC Order
  });

  // Set Month Year
  function onMonthYearSelectedHandler(time) {
    let fromdate;
    let todate;
    let month;
    const mm = moment().month(time).format('MM');
    const daysInMonth = moment(moment().format(`YYYY-${mm}`)).daysInMonth();

    fromdate = moment(new Date(`${year}-${mm}-01`), 'YYYY-MM-DD').format(
      'YYYY-MM-DD',
    );
    todate = moment(
      new Date(`${year}-${mm}-${daysInMonth}`),
      'YYYY-MM-DD',
    ).format('YYYY-MM-DD');
    month = moment(fromdate).month() + 1;

    setFromDate(fromdate);
    setToDate(todate);
    setShowMonthYearListMenu(false);
  }

  function showMonthYearListMenuHandler() {
    setShowMonthYearListMenu(show => !show);
  }

  function customClickedHandler() {
    setShowCustomDate(true);
    setRightMenuClicked(false);
  }

  function monthlyClickedHandler() {
    setFromDate(initFromDate);
    setToDate(initToDate);

    setShowCustomDate(false);
    setRightMenuClicked(false);
  }

  function rightMenuClickedHandler() {
    setRightMenuClicked(clicked => !clicked);
  }

  function fromDateClickedHandler() {
    showDatePicker();
    setFromDateClicked(true);
  }

  function toDateClickedHandler() {
    showDatePicker();
    setToDateClicked(true);
  }

  // DatePicker Function
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  function hideDatePicker() {
    setDatePickerVisibility(false);
  }

  // function onChange(event, selectedDate) {
  //   // const currentDate = selectedDate || date;
  //   if (Platform.OS === 'android') {
  //     setDatePickerVisibility(true);
  //   }
  //   let date = moment(event).format('YYYY-MM-DD');

  //   if (fromDateClicked) {
  //     setFromDate(date);
  //   }
  //   if (toDateClicked) {
  //     setToDate(date);
  //   }
  // }

  const onConfirm = date => {
    const fromdate = moment(date).format('YYYY-MM-DD');
    const todate = moment(date).format('YYYY-MM-DD');
    if (fromDateClicked) {
      setFromDate(fromdate);
    }
    if (toDateClicked) {
      setToDate(todate);
    }
    setFromDateClicked(false);
    setToDateClicked(false);
    hideDatePicker();
  };

  const renderItem = ({item}) => {
    // expense: item.Products[0]
    // income: item.Products[1]
    const expenseAmount = +item.Products[0]?.amount;
    const incomeAmount = +item.Products[1]?.amount;

    // get category
    const expenseCategory = ExpenseCategory?.filter(
      cate => cate.id === item?.Products[0]?.cateId,
    );
    const incomeCategory = IncomeCategory?.filter(
      cate => cate.id === item?.Products[1]?.cateId,
    );

    // get account category

    const expenseCash = CashCategory?.filter(
      cate => cate.id === item?.Products[0]?.accountId,
    );
    const expenseAccount = AccountCategory?.filter(
      cate => cate.id === item?.Products[0]?.accountId,
    );
    let expenseCateAcc = expenseCash;
    if (expenseCateAcc?.length === 0) {
      expenseCateAcc = expenseAccount;
    }

    const incomeCash = CashCategory?.filter(
      cate => cate.id === item?.Products[1]?.accountId,
    );
    const incomeAccount = AccountCategory?.filter(
      cate => cate.id === item?.Products[1]?.accountId,
    );
    let incomeCateAcc = incomeCash;
    if (incomeCateAcc?.length === 0) {
      incomeCateAcc = incomeAccount;
    }

    const date = new Date(item?.Products[0]?.date);
    let day = moment(date).date();
    if (day < 10) {
      day = `0${day}`;
    }
    const dayLabel = moment(date).format('ddd');
    const monthLabel = moment(date).format('MMM');
    const year = moment(date).year();

    return (
      <View style={styles.list}>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() =>
            navigation.navigate('AddDetails', {
              amount: incomeAmount,
              transaction: {
                categoryTitle: incomeCategory[0]?.title,
                type: 'income',
                // note: note,
                account: incomeCateAcc[0]?.title,
                date: date,
              },
            })
          }>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: width / 4,
              marginLeft: -25,
              // backgroundColor: '#e1f3cd',
            }}>
            <Text style={{fontSize: 14, color: 'blue', alignSelf: 'center'}}>
              {incomeAmount}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() =>
            navigation.navigate('AddDetails', {
              amount: expenseAmount,
              transaction: {
                categoryTitle: expenseCategory[0]?.title,
                type: 'expense',
                // note: note,
                account: expenseCateAcc[0]?.title,
                date: date,
              },
            })
          }>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: width / 4,
              marginLeft: -50,
              // backgroundColor: '#f5bebe',
            }}>
            <Text style={{fontSize: 14, color: 'red', alignSelf: 'center'}}>
              {expenseAmount}
            </Text>
            {/* <Text style={{fontSize: 10, color: 'grey'}}>{expenseCategory}</Text> */}
          </View>
        </Pressable>

        <View style={styles.dateContainer}>
          <View style={styles.dateLabel}>
            <Text style={{fontSize: 12, color: 'white'}}>{dayLabel}</Text>
          </View>
          <Text style={{fontSize: 16, fontWeight: '800'}}>{day} </Text>
          <Text style={{fontSize: 12, color: 'grey'}}>{monthLabel} </Text>
          <Text style={{fontSize: 12, color: 'grey'}}>{year}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <View>
          <Text>Deposit</Text>
          <Text style={{color: 'blue'}}>
            {totalIncomeByAccount?.toFixed(2)}
          </Text>
        </View>
        <View>
          <Text>Withdraw</Text>
          <Text style={{color: 'red'}}>
            {totalExpenseByAccount?.toFixed(2)}
          </Text>
        </View>
        <View>
          <Text>Total</Text>
          <Text>{total?.toFixed(2)}</Text>
        </View>
        <View>
          <Text>Balance</Text>
          <Text>{balance?.toFixed(2)}</Text>
        </View>
      </View>

      <View style={{marginBottom: 110}}>
        <FlatList
          keyExtractor={item => item + uuidv4()}
          data={filteredCustomData}
          renderItem={renderItem}
          bounces={false}
          navigation={navigation}
          inverted
        />
      </View>

      {rightMenuClicked && (
        <MenuHandler
          monthlyClickedHandler={monthlyClickedHandler}
          customClickedHandler={customClickedHandler}
        />
      )}

      {showMonthYearListMenu && (
        <MonthYearList
          monthlyPressed={false}
          onMonthYearSelectedHandler={onMonthYearSelectedHandler}
          year={year}
          setYear={setYear}
        />
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        // onChange={onChange}
        onCancel={hideDatePicker}
        onConfirm={onConfirm}
        value={toDateClicked ? toDate : fromDateClicked ? fromDate : ''}
        mode={mode}
        // today={onTodayHandler}
        is24Hour={true}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        style={styles.datePicker}
      />
    </View>
  );
}

export default AccountsItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightMenu: {
    marginRight: 10,
    backgroundColor: '#ffffff',
    borderWidth: 0.8,
    borderColor: '#d4d4d4',
    borderRadius: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
  },
  headerMenuText: {
    fontSize: 14,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
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
  listMenu: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: 120,
    height: 100,
    borderWidth: 0.8,
    borderRadius: 5,
    borderColor: '#d4d4d4',
    backgroundColor: '#ffffff',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    position: 'absolute',
    top: 0,
    right: 2,
  },
  customDate: {
    marginRight: 20,
    marginTop: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderColor: '#d4d4d4',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.35,
    shadowRadius: 0.5,
    elevation: 1,
  },
  customDateText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.75,
  },
});

import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import {EXPENSES, INCOME} from '../dummy/dummy';
import {ExpenseCategory} from '../dummy/categoryItems';
import IconButton from '../components/UI/iconButton';
import TransactionOutput from '../components/Output/TransactionOutput';
import MonthYearList from '../components/Menu/MonthYearList';
import {TransactionNavigationProp} from '../types';
import {ExpenseType} from '../models/expense';
import {CategoryType} from '../models/category';
import {IncomeType} from '../models/income';

type Props = {
  navigation: TransactionNavigationProp;
};

const {width} = Dimensions.get('window');

const TransactionsScreen = ({navigation}: Props) => {
  const [expenseCateData, setExpenseCateData] = useState<CategoryType>();
  const [expenseData, setExpenseData] = useState<ExpenseType>();
  const [incomeData, setIncomeData] = useState<IncomeType>();
  const [fromDate, setFromDate] = useState<string | null>();
  const [toDate, setToDate] = useState<string | null>();
  const [monthlyPressed, setMonthlyPressed] = useState<boolean>(true);
  const [showMonthYearListMenu, setShowMonthYearListMenu] =
    useState<boolean>(false);
  const [weeklyPressed, setWeeklyPressed] = useState<boolean>(false);
  const [dailyPressed, setDailyPressed] = useState<boolean>(false);
  const [customPressed, setCustomPressed] = useState<boolean>(false);
  const [duration, setDuration] = useState<string | null>(
    String(moment().year()),
  );
  const [month, setMonth] = useState<string | null>();
  const [year, setYear] = useState<string | null>(String(moment().year()));
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [mode, setMode] = useState<string | null>('date');
  const [fromDateClicked, setFromDateClicked] = useState<boolean>(false);
  const [toDateClicked, setToDateClicked] = useState<boolean>(false);

  // Initial from date, to date
  useEffect(() => {
    onMonthYearSelectedHandler(moment().year());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            // alignItems: 'center',
            width: width * 0.5,
            // backgroundColor: '#fed8d8',
          }}>
          {!customPressed && (
            <Pressable
              style={({pressed}) => pressed && styles.pressed}
              onPress={() => showMonthYearListMenuHandler()}>
              <View
                style={{
                  marginRight: 25,
                  paddingHorizontal: 5,
                  paddingVertical: 3.5,
                  borderWidth: 0.6,
                  borderColor: 'grey',
                }}>
                <Text>{`${duration} ${!monthlyPressed ? year : ''}`}</Text>
              </View>
            </Pressable>
          )}

          {customPressed && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: width * 0.5,
                marginRight: width / 8,
                // borderWidth: 0.6,
                // borderColor: 'lightgrey',
              }}>
              <Pressable
                style={({pressed}) => pressed && styles.pressed}
                onPress={onFromDateHandler}>
                <View style={{borderWidth: 0.6, borderColor: 'lightgrey'}}>
                  <Text>{moment(fromDate).format('YYYY-MM-DD')}</Text>
                </View>
              </Pressable>
              <Pressable
                style={({pressed}) => pressed && styles.pressed}
                onPress={onToDateHandler}>
                <View style={{borderWidth: 0.6, borderColor: 'lightgrey'}}>
                  {/* <Text>2022-09-30</Text> */}
                  <Text>{moment(toDate).format('YYYY-MM-DD')}</Text>
                </View>
              </Pressable>
            </View>
          )}

          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => navigation.navigate('Stats')}>
            <View style={{marginRight: 20}}>
              <Ionicons name="stats-chart-outline" size={20} color="#0047b8" />
            </View>
          </Pressable>
        </View>
      ),
    });
  }, [
    navigation,
    duration,
    year,
    setShowMonthYearListMenu,
    showMonthYearListMenuHandler,
  ]);

  // set data
  useEffect(() => {
    setExpenseCateData(ExpenseCategory);
    setExpenseData(EXPENSES);
    setIncomeData(INCOME);
    // setAccountsData(AccountCategory);
  }, []);

  if (
    expenseCateData === null ||
    expenseCateData === undefined ||
    expenseData === null ||
    expenseData === undefined
  ) {
    return <ActivityIndicator />;
  }

  //sort Data
  expenseData.sort((a: any, b: any) => {
    const dateA = new Date(a.date).valueOf();
    const dateB = new Date(b.date).valueOf();
    if (dateA > dateB) {
      return -1; // return -1 here for DESC order
    }
    return 1; // return 1 here for DESC Order
  });

  function onMonthYearSelectedHandler(time: number) {
    let fromdate;
    let todate;
    let month;

    const mm = moment().month(time).format('MM');
    const daysInMonth = moment(
      moment().format(`YYYY-${mm}`),
      'YYYY-MM',
    ).daysInMonth();

    if (monthlyPressed) {
      fromdate = moment().startOf('year').format(`${time}-01-01`);
      todate = moment().endOf('year').format(`${time}-12-31`);
      month = moment().month() + 1;
      setYear(String(moment(fromdate).year()));
    }
    if (!monthlyPressed) {
      fromdate = moment(new Date(`${year}-${mm}-01`), 'YYYY-MM-DD');
      todate = moment(new Date(`${year}-${mm}-${daysInMonth}`), 'YYYY-MM-DD');
      month = moment(fromdate).month() + 1;
    }

    setFromDate(String(fromdate));
    setToDate(String(todate));
    setDuration(String(time));
    setMonth(String(month));
    setShowMonthYearListMenu(false);
  }

  function showMonthYearListMenuHandler() {
    setShowMonthYearListMenu(!showMonthYearListMenu);
  }

  function onFromDateHandler() {
    showDatePicker();
    setFromDateClicked(true);
  }

  function onToDateHandler() {
    showDatePicker();
    setToDateClicked(true);
  }

  // DatePicker Function
  // function onChange(event, selectedDate) {
  //   // const currentDate = selectedDate || DATE;
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  function hideDatePicker() {
    setDatePickerVisibility(false);
  }

  const onConfirm = date => {
    const fromDate = moment(date).format('YYYY-MM-DD');
    const todate = moment(date).format('YYYY-MM-DD');
    if (fromDateClicked) {
      setFromDate(fromDate);
    }
    if (toDateClicked) {
      setToDate(todate);
    }
    setFromDateClicked(false);
    setToDateClicked(false);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <TransactionOutput
        expenseData={expenseData}
        incomeData={incomeData}
        setDuration={setDuration}
        setFromDate={setFromDate}
        fromDate={fromDate}
        setToDate={setToDate}
        toDate={toDate}
        monthlyPressed={monthlyPressed}
        setMonthlyPressed={setMonthlyPressed}
        weeklyPressed={weeklyPressed}
        setWeeklyPressed={setWeeklyPressed}
        dailyPressed={dailyPressed}
        setDailyPressed={setDailyPressed}
        setCustomPressed={setCustomPressed}
        customPressed={customPressed}
        year={year}
        month={month}
      />

      {showMonthYearListMenu && (
        <MonthYearList
          monthlyPressed={monthlyPressed}
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

      <View style={styles.addButtonContainer}>
        <IconButton
          name="add"
          size={15}
          onPress={() => navigation.navigate('AddExpenses')}
        />
      </View>
    </View>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButtonContainer: {
    backgroundColor: '#5d91f0',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 3,

    position: 'absolute',
    right: 20,
    bottom: 20,
  },

  pressed: {
    opacity: 0.65,
  },
});

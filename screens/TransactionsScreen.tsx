import {
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

import TransactionOutput from '../components/Output/TransactionOutput';
import MonthYearList from '../components/Menu/MonthYearList';
import {TransactionNavigationProp} from '../types';
import AddBtn from '../components/UI/AddBtn';

type Props = {
  navigation: TransactionNavigationProp;
};

const {width} = Dimensions.get('window');

const initialStartDate = moment(`${moment().year()}-01-01`).format(
  'YYYY-MM-DD',
);
const initialToDate = moment(`${moment().year()}-12-31`).format('YYYY-MM-DD');

const TransactionsScreen = ({navigation}: Props) => {
  // const dispatch = useAppDispatch();

  const [fromDate, setFromDate] = useState<string | null>(initialStartDate);
  const [toDate, setToDate] = useState<string | null>(initialToDate);
  const [monthlyPressed, setMonthlyPressed] = useState<boolean>(true);
  const [showMonthYearListMenu, setShowMonthYearListMenu] =
    useState<boolean>(false);
  const [weeklyPressed, setWeeklyPressed] = useState<boolean>(false);
  const [dailyPressed, setDailyPressed] = useState<boolean>(false);
  const [customPressed, setCustomPressed] = useState<boolean>(false);
  const [duration, setDuration] = useState<string | null>();
  const [month, setMonth] = useState<string | null>();
  const [year, setYear] = useState<string | null>(String(moment().year()));
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [mode, setMode] = useState<string | null>('date');
  const [fromDateClicked, setFromDateClicked] = useState<boolean>(false);
  const [toDateClicked, setToDateClicked] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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
  }, [navigation, duration, year, showMonthYearListMenuHandler]);

  function onMonthYearSelectedHandler(time) {
    if (monthlyPressed) {
      const mm = moment().month(time).format('M');
      // const daysInMonth = moment(`${year}-0${mm}`, 'YYYY-MM').daysInMonth();
      const fromdate = moment([time, 0]).format('YYYY-MM-DD');
      const todate = moment(`${time}-12-31`).endOf('year').format('YYYY-MM-DD');

      setFromDate(String(fromdate));
      setToDate(String(todate));
      setDuration(String(time));
      setMonth(String(moment().month() + 1));
      setIsModalVisible(false);
    }
    if (!monthlyPressed) {
      const mm = moment().month(String(time)).format('M');
      const daysInMonth = moment(`${year}-${mm}`, 'YYYY-M').daysInMonth();
      const fromdate = moment([String(year), +mm - 1]).format('YYYY-MM-DD');
      const todate = moment(`${year}-0${mm}-${daysInMonth}`).format(
        'YYYY-MM-DD',
      );

      const month = moment(fromdate).month() + 1;

      setFromDate(String(fromdate));
      setToDate(String(todate));
      setDuration(String(time));
      setMonth(String(month));
      setIsModalVisible(false);
    }
  }

  function showMonthYearListMenuHandler() {
    setIsModalVisible(!isModalVisible);
  }

  function onFromDateHandler() {
    showDatePicker();
    setFromDateClicked(true);
  }

  function onToDateHandler() {
    showDatePicker();
    setToDateClicked(true);
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  function hideDatePicker() {
    setDatePickerVisibility(false);
  }

  const onConfirm = (date: string) => {
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
        setDuration={setDuration}
        setFromDate={setFromDate}
        fromDate={String(fromDate)}
        setToDate={setToDate}
        toDate={String(toDate)}
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
        // monthlyTransactions={monthlyTransactions}
        // weeklyTransactions={weeklyTransactions}
        // dailyTransactions={dailyTransactions}
      />

      <MonthYearList
        monthlyPressed={monthlyPressed}
        onMonthYearSelectedHandler={onMonthYearSelectedHandler}
        year={year}
        setYear={setYear}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      />

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

      <AddBtn
        onPress={() => navigation.navigate('AddExpenses')}
        style={{bottom: -0}}
        icon={'plus-circle'}
        size={width * 0.18}
        color={'#b6482a'}
      />
    </View>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // addButtonContainer: {
  //   backgroundColor: '#5d91f0',
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   borderWidth: 0.5,
  //   borderColor: '#fff',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   shadowOffset: {width: 0, height: 0},
  //   shadowOpacity: 0.7,
  //   shadowRadius: 3,
  //   elevation: 3,

  //   position: 'absolute',
  //   right: 20,
  //   bottom: 20,
  // },

  pressed: {
    opacity: 0.65,
  },
});

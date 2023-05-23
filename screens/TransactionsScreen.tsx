import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import TransactionOutput from '../components/Output/TransactionOutput';
import MonthYearList from '../components/Menu/MonthYearList';
import {TransactionNavigationProp} from '../types';

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
  // const [showMonthYearListMenu, setShowMonthYearListMenu] =
  //   useState<boolean>(false);
  const [weeklyPressed, setWeeklyPressed] = useState<boolean>(false);
  const [dailyPressed, setDailyPressed] = useState<boolean>(false);
  const [customPressed, setCustomPressed] = useState<boolean>(false);
  const [duration, setDuration] = useState<string | null>(
    moment().format('MMM'),
  );
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>(moment().year());
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [mode, setMode] = useState<string>('date');
  const [fromDateClicked, setFromDateClicked] = useState<boolean>(false);
  const [toDateClicked, setToDateClicked] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [indicatorIndex, setIndicatorIndex] = useState<number | undefined>(0);
  const [exportPressed, setExportPressed] = useState<boolean>(false);

  // Initial from date, to date
  useEffect(() => {
    let initTime = moment().year();
    onMonthYearSelectedHandler(initTime);
  }, []);

  // useEffect when focus
  useFocusEffect(
    useCallback(() => {
      // alert('Screen was focused');
      // Do something when the screen is focused

      return () => {
        // alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        setIndicatorIndex(2);
        setMonthlyPressed(false);
        setWeeklyPressed(false);
        setDailyPressed(true);
        setCustomPressed(false);
        setExportPressed(false);
      };
    }, []),
  );

  console.log('duration: ', duration);
  console.log('Type duration: ', typeof duration);

  useEffect(() => {
    navigation.setOptions({
      title: !customPressed ? 'Transactions' : '',
      headerTitleAlign: 'left',
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
    showMonthYearListMenuHandler,
    monthlyPressed,
    weeklyPressed,
    dailyPressed,
  ]);

  function onMonthYearSelectedHandler(time) {
    if (monthlyPressed) {
      // const mm = moment().month(time).format('M');
      // const daysInMonth = moment(`${year}-0${mm}`, 'YYYY-MM').daysInMonth();
      const fromdate = moment([time, 0]).format('YYYY-MM-DD');
      const todate = moment(`${time}-12-31`).endOf('year').format('YYYY-MM-DD');
      setYear(time);

      setFromDate(fromdate);
      setToDate(todate);
      setDuration(time);
      setMonth(+moment().month() + 1);
      setIsModalVisible(false);
    }
    if (!monthlyPressed) {
      const mm = moment().month(time).format('M');
      const daysInMonth = moment(`${year}-${mm}`, 'YYYY-M').daysInMonth();
      const fromdate = moment([year, +mm - 1]).format('YYYY-MM-DD');
      const todate = moment(`${year}-0${mm}-${daysInMonth}`).format(
        'YYYY-MM-DD',
      );

      const month = moment(fromdate).month() + 1;

      setFromDate(fromdate);
      setToDate(todate);
      setDuration(time);
      setMonth(month);
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
        duration={duration}
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
        setExportPressed={setExportPressed}
        exportPressed={exportPressed}
        year={year}
        month={month}
        setIndicatorIndex={setIndicatorIndex}
        indicatorIndex={indicatorIndex}
      />

      <MonthYearList
        monthlyPressed={monthlyPressed}
        onMYSelectedHandler={onMonthYearSelectedHandler}
        year={+year}
        setYear={setYear}
        month={month}
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
    </View>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  pressed: {
    opacity: 0.65,
  },
});

// ============================ TYPE =====================================
type Props = {
  navigation: TransactionNavigationProp;
};

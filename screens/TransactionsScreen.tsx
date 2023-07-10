import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
// import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import TransactionOutput from '../components/Output/TransactionOutput';
import MonthYearList from '../components/Menu/MonthYearList';
import {TransactionNavigationProp} from '../types';
import {useSwipe} from '../components/UI/useSwape';
import Screen1 from '../components/tab/Screen1';
import Screen2 from '../components/tab/Screen2';
import Screen3 from '../components/tab/Screen3';
import Tabs from '../components/UI/Tabs';

const {width, height} = Dimensions.get('window');

const initialStartDate = moment(`${moment().year()}-01-01`).format(
  'YYYY-MM-DD',
);
const initialToDate = moment(`${moment().year()}-12-31`).format('YYYY-MM-DD');

const TabsDataObject = {
  monthly: 'Monthly',
  weekly: 'Weekly',
  daily: 'Daily',
  custom: 'Custom',
  export: 'Export',
};

// Swipe Screen
const TopTab = createMaterialTopTabNavigator();

function TransactionArea({}) {
  return (
    <TopTab.Navigator
      screenListeners={{
        state: e => {
          // Do something with the state
          // console.log(e.data?.state?.index);
        },
      }}
      screenOptions={() => ({
        tabBarIndicatorStyle: {backgroundColor: 'transparent'},
        tabBarShowLabel: false,
        tabBarContentContainerStyle: {height: 0},
      })}>
      <TopTab.Screen name="Screen1" component={Screen1} />
      <TopTab.Screen name="Screen2" component={Screen2} />
      <TopTab.Screen name="Screen3" component={Screen3} />
    </TopTab.Navigator>
  );
}

// Main
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

  useEffect(() => {
    navigation.setOptions({
      // title: !customPressed && !exportPressed ? 'Transactions' : '',
      title: '',
      headerTitleAlign: 'left',
      // headerStyle: {
      //   height: height * 0.06,
      //   backgroundColor: '#b1fd90',
      // },
      headerRight: () => (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginLeft: width / 2,
              width: width * 0.5,
              marginTop: height * 0.032,
              // backgroundColor: '#fed8d8',
            }}>
            {!customPressed && !exportPressed && (
              <Pressable
                style={({pressed}) => pressed && styles.pressed}
                onPress={() => showMonthYearListMenuHandler()}>
                <View
                  style={{
                    marginRight: 25,
                    // marginTop: 20,
                    paddingHorizontal: 5,
                    paddingVertical: 3.5,
                    borderWidth: 0.6,
                    borderColor: 'grey',
                  }}>
                  <Text>{`${duration} ${!monthlyPressed ? year : ''}`}</Text>
                </View>
              </Pressable>
            )}

            {(customPressed || exportPressed) && (
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
                <Ionicons
                  name="stats-chart-outline"
                  size={20}
                  color="#0047b8"
                />
              </View>
            </Pressable>
          </View>
          {/* <View
            style={{
              // backgroundColor: 'red',
              marginTop: 10,
            }}> */}
          <Tabs
            TabsDataObject={TabsDataObject}
            onItemPress={onItemPress}
            indicatorIndex={indicatorIndex}
          />
          {/* </View> */}
        </>
      ),
    });
  }, [
    navigation,
    duration,
    year,
    // showMonthYearListMenuHandler,
    isModalVisible,
    monthlyPressed,
    weeklyPressed,
    dailyPressed,
    customPressed,
    exportPressed,
  ]);

  //
  const onItemPress = useCallback(
    (itemIndex: number) => {
      setIndicatorIndex(itemIndex);
      if (itemIndex === 0) {
        monthlyHandler();
      }
      if (itemIndex === 1) {
        weeklyHandler();
      }
      if (itemIndex === 2) {
        dailyHandler();
      }
      if (itemIndex === 3) {
        customHandler();
      }
      if (itemIndex === 4) {
        exportsHandler();
      }
    },
    [
      monthlyPressed,
      weeklyPressed,
      dailyPressed,
      customPressed,
      exportPressed,
      duration,
    ],
  );

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

  //----
  //----
  // Month Func
  const monthlyHandler = () => {
    // const fromdate = moment(`${year}-01-01`);
    // const todate = moment(`${year}-12-31`);
    const fromdate = moment(`${year}-01-01`).format('YYYY-MM-DD');
    const todate = moment(`${year}-12-31`).format('YYYY-MM-DD');

    setFromDate(fromdate);
    setToDate(todate);
    setMonthlyPressed(true);
    setWeeklyPressed(false);
    setDailyPressed(false);
    setCustomPressed(false);
    setExportPressed(false);
    setDuration(year);
    // setDuration(String(moment(toDate).year()));
  };

  // Week Func
  const weeklyHandler = () => {
    let Month = month === '' ? `${moment().month() + 1}` : month;

    if (+Month < 10) {
      Month = `0${Month}`;
    }

    let currentDate = moment().date();
    if (currentDate < 10) {
      currentDate = +`0${currentDate}`;
    }
    const date = moment(`${year}-${Month}-${currentDate}`).format('YYYY-MM-DD');

    const daysInMonth = moment(
      moment().format(`YYYY-${Month}`),
      'YYYY-MM',
    ).daysInMonth();
    const fromdate = moment(`${year}-${Month}-01`).format('YYYY-MM-DD');
    const todate = moment(`${year}-${Month}-${daysInMonth}`).format(
      'YYYY-MM-DD',
    );

    setFromDate(fromdate);
    setToDate(todate);
    typeof duration === 'number'
      ? setDuration(moment.monthsShort(moment(date).month()))
      : '';

    // Reset
    setMonthlyPressed(false);
    setWeeklyPressed(true);
    setDailyPressed(false);
    setCustomPressed(false);
    setExportPressed(false);
  };

  const dailyHandler = () => {
    let Month = month === '' ? `${moment().month() + 1}` : month;

    if (+Month < 10) {
      Month = `0${Month}`;
    }

    const date = moment().format(`${year}-${Month}-DD`);
    const daysInMonth = moment(
      moment().format(`YYYY-${Month}`),
      'YYYY-MM',
    ).daysInMonth();
    const fromdate = moment(`${year}-${Month}-01`).format('YYYY-MM-DD');
    const todate = moment(`${year}-${Month}-${daysInMonth}`).format(
      'YYYY-MM-DD',
    );

    setFromDate(fromdate);
    setToDate(todate);

    typeof duration === 'number'
      ? setDuration(moment.monthsShort(moment(date).month()))
      : '';

    setMonthlyPressed(false);
    setWeeklyPressed(false);
    setDailyPressed(true);
    setCustomPressed(false);
    setExportPressed(false);
  };

  const customHandler = () => {
    if (+month < 10) {
      month = `0${month}`;
    }

    let today = moment().date();
    if (+today < 10) {
      today = +`0${today}`;
    }

    const fromdate = moment(`${year}-${month}-01`).format('YYYY-MM-DD');
    const todate = moment(`${year}-${month}-${today}`).format('YYYY-MM-DD');

    setFromDate(fromdate);
    setToDate(todate);
    setMonthlyPressed(false);
    setWeeklyPressed(false);
    setDailyPressed(false);
    setCustomPressed(true);
    setExportPressed(false);
  };

  async function exportsHandler() {
    setExportPressed(true);
    setMonthlyPressed(false);
    setWeeklyPressed(false);
    setDailyPressed(false);
    setCustomPressed(false);

    const authUser = await Auth.currentAuthenticatedUser();
    const appUserId = authUser?.attributes?.sub;
    const filteredCustomerInfo = customerInfosData?.filter(
      cus => cus.appUserId === appUserId,
    );

    if (
      !filteredCustomerInfo[0]?.stdActive &&
      !filteredCustomerInfo[0]?.proActive
    ) {
      // show Ads
      if (isLoaded) {
        show();
      }
    }
  }

  return (
    <View style={styles.container}>
      <TransactionArea />

      {/* <TransactionOutput
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
      /> */}

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

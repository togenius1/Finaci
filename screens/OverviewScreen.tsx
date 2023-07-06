import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Purchases from 'react-native-purchases';

import Spending from '../components/tab/SpendingTab';
import Expense from '../components/tab/ExpenseTab';
import Income from '../components/tab/IncomeTab';
import MonthYearList from '../components/Menu/MonthYearList';
import {OverviewNavigationProp} from '../types';
import AddBtn from '../components/UI/AddBtn';
import Menu from '../components/Menu/Menu';
import {useFocusEffect} from '@react-navigation/native';

type Props = {
  navigation: OverviewNavigationProp;
};

const {width, height} = Dimensions.get('window');

let MONTH = moment().month() + 1;
if (MONTH < 10) {
  MONTH = +`0${MONTH}`;
}
const initFromDateString = `${moment().year()}-${MONTH}-01`;
const initFromDate = moment(initFromDateString).format('YYYY-MM-DD');
const initToDate = moment().format('YYYY-MM-DD');

const TopTab = createMaterialTopTabNavigator();
// const navigation = useNavigation();

function OverviewTab({setFocusedTabIndex, fromDate, toDate}) {
  return (
    <TopTab.Navigator
      screenListeners={{
        state: e => {
          // Do something with the state
          setFocusedTabIndex(e.data?.state?.index);
        },
      }}
      screenOptions={() => ({
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: '#7e7e7e',
        tabBarIndicatorStyle: {backgroundColor: 'red'},
      })}>
      <TopTab.Screen
        name="Spending"
        component={Spending}
        initialParams={{fromDate: fromDate, toDate: toDate}}
      />
      <TopTab.Screen
        name="Expense"
        component={Expense}
        initialParams={{fromDate: fromDate, toDate: toDate}}
      />
      <TopTab.Screen
        name="Income"
        component={Income}
        initialParams={{fromDate: fromDate, toDate: toDate}}
      />
    </TopTab.Navigator>
  );
}

function HeaderRightComponent({
  fromDate,
  toDate,
  showCustomDate,
  fromDateClickedHandler,
  toDateClickedHandler,
  rightMenuClickedHandler,
  // showMonthYearListMenuHandler,
  setIsMYListVisible,
}) {
  const month = moment.monthsShort(moment(toDate).month());
  const year = moment(toDate).year();

  return (
    <View style={styles.headerRightContainer}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => setIsMYListVisible(true)}>
        {!showCustomDate && (
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
              <Text style={styles.customDateText}>{fromDate}</Text>
            </View>
          </Pressable>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              toDateClickedHandler();
            }}>
            <View style={styles.customDate}>
              <Text style={styles.customDateText}>{toDate}</Text>
            </View>
          </Pressable>
        </>
      )}
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => {
          rightMenuClickedHandler();
        }}>
        <View style={styles.headerRightMenu}>
          <Text style={styles.headerMenuText}>
            {showCustomDate ? 'Custom' : 'Monthly'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

// Main
const OverviewScreen = ({navigation}: Props) => {
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [mode, setMode] = useState<string | null>('date');
  const [fromDate, setFromDate] = useState<string | null>(initFromDate);
  const [toDate, setToDate] = useState<string | null>(initToDate);
  const [fromDateClicked, setFromDateClicked] = useState<boolean>(false);
  const [toDateClicked, setToDateClicked] = useState<boolean>(false);
  const [rightMenuClicked, setRightMenuClicked] = useState<boolean>(false);
  const [showCustomDate, setShowCustomDate] = useState<boolean>(false);
  const [focusedTabIndex, setFocusedTabIndex] = useState<number | undefined>(0);
  // const [showMonthYearListMenu, setShowMonthYearListMenu] =
  //   useState<boolean>(false);
  const [year, setYear] = useState<string | null>(String(moment().year()));
  const [isMYListVisible, setIsMYListVisible] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // const [duration, setDuration] = useState(moment().year());
  const [month, setMonth] = useState<string | null>(String(MONTH));

  // useEffect when focus
  useFocusEffect(
    useCallback(() => {
      // alert('Screen was focused');
      // Do something when the screen is focused
      setShowCustomDate(false);
      setFocusedTabIndex(0);

      return () => {
        // alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  useEffect(() => {
    if (focusedTabIndex === 0 || focusedTabIndex === 1) {
      setShowCustomDate(false);
    }
  }, [focusedTabIndex]);

  useEffect(() => {
    onMonthYearSelectedHandler(moment().month());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: showCustomDate ? '' : 'Overview',
      headerTitleAlign: 'left',
      // headerTitleContainerStyle: {marginLeft: 0},
      headerRight: () => (
        <HeaderRightComponent
          fromDate={fromDate}
          toDate={toDate}
          showCustomDate={showCustomDate}
          fromDateClickedHandler={fromDateClickedHandler}
          toDateClickedHandler={toDateClickedHandler}
          rightMenuClickedHandler={rightMenuClickedHandler}
          setIsMYListVisible={setIsMYListVisible}
        />
      ),
    });
  }, [
    rightMenuClicked,
    fromDate,
    toDate,
    showCustomDate,
    navigation,
    // showMonthYearListMenu,
  ]);

  useEffect(() => {
    if (focusedTabIndex === 0) {
      sendParamsToSpendingTabHandler();
    }
    if (focusedTabIndex === 1) {
      sendParamsToExpenseTabHandler();
    }
    if (focusedTabIndex === 2) {
      sendParamsToIncomeTabHandler();
    }
  }, [focusedTabIndex, fromDate, toDate]);

  // Set Month Year
  function onMonthYearSelectedHandler(time) {
    let fromdate;
    let todate;
    // let month;
    const mm = moment().month(time).format('MM');

    // const daysInMonth = moment(`YYYY-${mm}-DD`).daysInMonth();
    const daysInMonth = moment(
      moment().format(`YYYY-${mm}`),
      'YYYY-MM',
    ).daysInMonth();
    fromdate = moment(`${year}-${mm}-01`).format('YYYY-MM-DD');
    todate = moment(`${year}-${mm}-${daysInMonth}`).format('YYYY-MM-DD');
    // month = moment(fromdate).month() + 1;

    setFromDate(moment(fromdate).format('YYYY-MM-DD'));
    setToDate(moment(todate).format('YYYY-MM-DD'));

    const MONTH = moment(todate).format('M');
    setMonth(MONTH);
    setIsMYListVisible(false);
  }

  // function showMonthYearListMenuHandler() {
  //   setShowMonthYearListMenu(show => !show);
  // }

  function rightMenuClickedHandler() {
    // setRightMenuClicked(!rightMenuClicked);
    setIsMenuOpen(true);
  }

  function monthlyClickedHandler() {
    setFromDate(initFromDate);
    setToDate(initToDate);
    if (focusedTabIndex === 0) {
      sendParamsToSpendingTabHandler();
    }
    if (focusedTabIndex === 1) {
      sendParamsToExpenseTabHandler();
    }
    if (focusedTabIndex === 2) {
      sendParamsToIncomeTabHandler();
    }

    setShowCustomDate(false);
    setRightMenuClicked(false);
    // setFocusedExpenseTab(false)
    setIsMenuOpen(false);
  }

  function customClickedHandler() {
    setShowCustomDate(true);
    setRightMenuClicked(false);
    // setFocusedExpenseTab(true);
    setIsMenuOpen(false);
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
  function onChange(event, selectedDate) {
    // const currentDate = selectedDate || DATE;
    if (Platform.OS === 'android') {
      setDatePickerVisibility(true);
    }
    let date = moment(event).format('YYYY-MM-DD');
    if (fromDateClicked) {
      setFromDate(date);
    }
    if (toDateClicked) {
      setToDate(date);
    }
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  function hideDatePicker() {
    setDatePickerVisibility(false);
  }

  const onConfirm = date => {
    if (fromDateClicked) {
      setFromDate(moment(date).format('YYYY-MM-DD'));
    }
    if (toDateClicked) {
      setToDate(moment(date).format('YYYY-MM-DD'));
    }
    if (focusedTabIndex === 0) {
      sendParamsToSpendingTabHandler();
    }
    if (focusedTabIndex === 1) {
      sendParamsToExpenseTabHandler();
    }
    if (focusedTabIndex === 2) {
      sendParamsToIncomeTabHandler();
    }
    setFromDateClicked(false);
    setToDateClicked(false);
    hideDatePicker();
  };

  const sendParamsToSpendingTabHandler = () => {
    navigation.navigate('Spending', {
      fromDate: fromDate,
      toDate: toDate,
    });
  };

  const sendParamsToExpenseTabHandler = () => {
    navigation.navigate('Expense', {
      fromDate: fromDate,
      toDate: toDate,
    });
  };

  const sendParamsToIncomeTabHandler = () => {
    navigation.navigate('Income', {
      fromDate: fromDate,
      toDate: toDate,
    });
  };

  return (
    <View style={styles.container}>
      <OverviewTab
        setFocusedTabIndex={setFocusedTabIndex}
        focusedTabIndex={focusedTabIndex}
        fromDate={fromDate}
        toDate={toDate}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        onChange={onChange}
        onCancel={hideDatePicker}
        onConfirm={onConfirm}
        value={toDateClicked ? toDate : fromDateClicked ? fromDate : ''}
        mode={mode}
        // today={onTodayHandler}
        is24Hour={true}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        style={styles.datePicker}
      />

      <Menu
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        monthlyClickedHandler={monthlyClickedHandler}
        customClickedHandler={customClickedHandler}
        focusedTabIndex={focusedTabIndex}
      />

      <MonthYearList
        monthlyPressed={false}
        onMYSelectedHandler={onMonthYearSelectedHandler}
        year={year}
        setYear={setYear}
        month={month}
        setIsModalVisible={setIsMYListVisible}
        isModalVisible={isMYListVisible}
      />

      <AddBtn
        onPress={() => navigation.navigate('AddExpenses')}
        color={'#b6482a'}
        // icon="plus"
        // size={20}
      />
    </View>
  );
};

export default OverviewScreen;

// Style
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
  datePicker: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    height: 260,
    borderBottomWidth: 1,
    borderColor: '#ba4646',
  },
  pressed: {
    opacity: 0.75,
  },
});

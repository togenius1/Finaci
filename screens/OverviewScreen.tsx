import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import Expense from './tab/ExpenseTab';
import Income from './tab/IncomeTab';
import MonthYearList from '../components/Menu/MonthYearList';
// import BarChartScreen from './screenComponents/BarChartTab';
// import BarchartTab from './screenComponents/BarChartTab';
// import {EXPENSES} from '../dummy/dummy';
import Spending from './tab/SpendingTab';
import {OverviewNavigationProp} from '../types';
import {Colors} from 'react-native/Libraries/NewAppScreen';

type Props = {
  navigation: OverviewNavigationProp;
};

const {width} = Dimensions.get('window');

let month = moment().month() + 1;
if (month < 10) {
  month = +`0${month}`;
}
const initFromDateString = `${moment().year()}-${month}-01`;
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

function MenuHandler({
  monthlyClickedHandler,
  customClickedHandler,
  focusedTabIndex,
}) {
  return (
    <View style={styles.listMenu}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => {
          monthlyClickedHandler();
        }}>
        <View
          style={{
            marginLeft: 10,
          }}>
          <Text>Monthly</Text>
        </View>
      </Pressable>
      {focusedTabIndex !== 0 && (
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
      )}
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
  const month = moment.monthsShort(moment(toDate).month());
  const year = moment(toDate).year();

  return (
    <View style={styles.headerRightContainer}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => showMonthYearListMenuHandler()}>
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

const OverviewScreen = ({navigation}: Props) => {
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [mode, setMode] = useState<string | null>('date');
  const [fromDate, setFromDate] = useState<string | null>(initFromDate);
  const [toDate, setToDate] = useState<string | null>(initToDate);
  const [fromDateClicked, setFromDateClicked] = useState<boolean>(false);
  const [toDateClicked, setToDateClicked] = useState<boolean>(false);
  const [rightMenuClicked, setRightMenuClicked] = useState<boolean>(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [focusedTabIndex, setFocusedTabIndex] = useState<number | undefined>(0);
  const [showMonthYearListMenu, setShowMonthYearListMenu] =
    useState<boolean>(false);
  const [year, setYear] = useState<string | null>(String(moment().year()));
  // const [duration, setDuration] = useState(moment().year());
  // const [month, setMonth] = useState();

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
          showMonthYearListMenuHandler={showMonthYearListMenuHandler}
        />
      ),
    });
  }, [
    rightMenuClicked,
    fromDate,
    toDate,
    showCustomDate,
    navigation,
    showMonthYearListMenu,
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
    const daysInMonth = moment(moment().format(`YYYY-${mm}`)).daysInMonth();
    fromdate = moment(new Date(`${year}-${mm}-01`), 'YYYY-MM-DD');
    todate = moment(new Date(`${year}-${mm}-${daysInMonth}`), 'YYYY-MM-DD');
    // month = moment(fromdate).month() + 1;

    setFromDate(moment(fromdate).format('YYYY-MM-DD'));
    setToDate(moment(todate).format('YYYY-MM-DD'));
    // setDuration(time);
    // setMonth(month);
    setShowMonthYearListMenu(false);
  }

  function showMonthYearListMenuHandler() {
    setShowMonthYearListMenu(show => !show);
  }

  function rightMenuClickedHandler() {
    setRightMenuClicked(!rightMenuClicked);
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
    // setFocusedExpenseTab(false);
  }

  function customClickedHandler() {
    setShowCustomDate(true);
    setRightMenuClicked(false);
    // setFocusedExpenseTab(true);
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

  // function onTodayHandler() {
  // setDATE(new Date());
  // setFromDate(moment().format('YYYY-MM-DD'));
  // }

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

      {rightMenuClicked && (
        <MenuHandler
          monthlyClickedHandler={monthlyClickedHandler}
          customClickedHandler={customClickedHandler}
          focusedTabIndex={focusedTabIndex}
        />
      )}

      {showMonthYearListMenu && (
        <MonthYearList
          // monthlyPressed={false}
          onMonthYearSelectedHandler={onMonthYearSelectedHandler}
          year={year}
          setYear={setYear}
        />
      )}
    </View>
  );
};

export default OverviewScreen;

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

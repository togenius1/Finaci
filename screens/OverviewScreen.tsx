import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import Spending from '../components/tab/SpendingTab';
import Expense from '../components/tab/ExpenseTab';
import Income from '../components/tab/IncomeTab';
import MonthYearList from '../components/Menu/MonthYearList';
import {OverviewNavigationProp} from '../types';
import AddBtn from '../components/UI/AddBtn';
import Menu from '../components/Menu/Menu';
import OverviewContext from '../store-context/overview-context';

type Props = {
  navigation: OverviewNavigationProp;
};

const {width} = Dimensions.get('window');

let MONTH = moment().month() + 1;
if (MONTH < 10) {
  MONTH = +`0${MONTH}`;
}
const initFromDateString = `${moment().year()}-${MONTH}-01`;
const initFromDate = moment(initFromDateString).format('YYYY-MM-DD');
const initToDate = moment().format('YYYY-MM-DD');

interface OverviewTabType {
  focusedTabIndex: number;
  setFocusedTabIndex: Dispatch<SetStateAction<number>>;
}

// Top tab
const TopTab = createMaterialTopTabNavigator();
// const navigation = useNavigation();

// Overview
function OverviewTab({setFocusedTabIndex, focusedTabIndex}: OverviewTabType) {
  return (
    <TopTab.Navigator
      // initialRouteName="Spending"
      screenListeners={{
        state: e => {
          // Do something with the state
          setFocusedTabIndex(+e.data?.state?.index);
        },
      }}
      screenOptions={() => ({
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: '#7e7e7e',
        tabBarIndicatorStyle: {backgroundColor: 'red'},
      })}>
      <TopTab.Screen name={'Spending'}>
        {() => focusedTabIndex === 0 && <Spending />}
      </TopTab.Screen>

      <TopTab.Screen name={'Expense'}>
        {() => focusedTabIndex === 1 && <Expense />}
      </TopTab.Screen>

      <TopTab.Screen name={'Income'}>
        {() => focusedTabIndex === 2 && <Income />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
}

interface HeaderRightType {
  fromDate: string;
  toDate: string;
  showCustomDate: boolean;
  fromDateClickedHandler: () => void;
  toDateClickedHandler: () => void;
  rightMenuClickedHandler: () => void;
  // setIsMYListVisible: (value: boolean) => void;
  setIsMYListVisible: (value: boolean) => void;
}

// Header Right
function HeaderRightComponent({
  fromDate,
  toDate,
  showCustomDate,
  fromDateClickedHandler,
  toDateClickedHandler,
  rightMenuClickedHandler,
  // showMonthYearListMenuHandler,
  setIsMYListVisible,
}: HeaderRightType) {
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
  // const [fromDate, setFromDate] = useState<string | null>(initFromDate);
  // const [toDate, setToDate] = useState<string | null>(initToDate);
  const [fromDateClicked, setFromDateClicked] = useState<boolean>(false);
  const [toDateClicked, setToDateClicked] = useState<boolean>(false);
  const [rightMenuClicked, setRightMenuClicked] = useState<boolean>(false);
  const [showCustomDate, setShowCustomDate] = useState<boolean>(false);
  const [focusedTabIndex, setFocusedTabIndex] = useState<number>(0);
  // const [showMonthYearListMenu, setShowMonthYearListMenu] =
  //   useState<boolean>(false);
  const [year, setYear] = useState<string | null>(String(moment().year()));
  const [isMYListVisible, setIsMYListVisible] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // const [duration, setDuration] = useState(moment().year());
  const [month, setMonth] = useState<string | null>(String(MONTH));

  const overviewCtx = useContext(OverviewContext);

  // useEffect when focus
  useFocusEffect(
    useCallback(() => {
      // alert('Screen was focused');
      // Do something when the screen is focused
      setShowCustomDate(false);
      // setFocusedTabIndex(0);

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
          fromDate={overviewCtx.fromDate}
          toDate={overviewCtx.toDate}
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
    overviewCtx.fromDate,
    overviewCtx.toDate,
    showCustomDate,
    navigation,
    // showMonthYearListMenu,
  ]);

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

    // setFromDate(moment(fromdate).format('YYYY-MM-DD'));
    // setToDate(moment(todate).format('YYYY-MM-DD'));
    overviewCtx.fromDateSetHandler({
      fromDate: fromdate,
    });
    overviewCtx.toDateSetHandler({
      toDate: todate,
    });

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
    // setFromDate(initFromDate);
    // setToDate(initToDate);
    overviewCtx.fromDateSetHandler({
      fromDate: initFromDate,
    });
    overviewCtx.toDateSetHandler({
      toDate: initToDate,
    });

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
      // setFromDate(date);
      overviewCtx.fromDateSetHandler({
        fromDate: date,
      });
    }
    if (toDateClicked) {
      // setToDate(date);
      overviewCtx.toDateSetHandler({
        toDate: date,
      });
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
      // setFromDate(moment(date).format('YYYY-MM-DD'));
      overviewCtx.fromDateSetHandler({
        fromDate: moment(date).format('YYYY-MM-DD'),
      });
    }
    if (toDateClicked) {
      // setToDate(moment(date).format('YYYY-MM-DD'));
      overviewCtx.toDateSetHandler({
        toDate: moment(date).format('YYYY-MM-DD'),
      });
    }

    setFromDateClicked(false);
    setToDateClicked(false);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <OverviewTab
        setFocusedTabIndex={setFocusedTabIndex}
        focusedTabIndex={focusedTabIndex}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        onChange={onChange}
        onCancel={hideDatePicker}
        onConfirm={onConfirm}
        value={
          toDateClicked
            ? overviewCtx.toDate
            : fromDateClicked
            ? overviewCtx.fromDate
            : ''
        }
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
        focusedTabIndex={Number(focusedTabIndex)}
      />

      <MonthYearList
        monthlyPressed={false}
        onMYSelectedHandler={onMonthYearSelectedHandler}
        year={Number(year)}
        setYear={setYear}
        month={Number(month)}
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

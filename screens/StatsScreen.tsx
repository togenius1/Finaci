import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';

// import IconButton from '../components/UI/iconButton';
// import BarChartTab from './screenComponents/BarChartTab';
import TimeLineTab from './screenComponents/TimeLineScreen';
import Tabs from '../components/UI/Tabs';
import LineChart from '../components/Graph/LineChart';
import {sumByCustomMonth} from '../util/math';
import {EXPENSES, INCOME} from '../dummy/dummy';
// import {useNavigation} from '@react-navigation/native';
import MonthYearList from '../components/Menu/MonthYearList';
import {StatsNavigationProp} from '../types';
import {ExpenseType} from '../models/expense';
import {IncomeType} from '../models/income';

type Props = {
  navigation: StatsNavigationProp;
};

// const {width, height} = Dimensions.get('window');

const dataTabsObject = {
  // barchart: 'BarChart',
  budget: 'Budgets',
  expense: 'Expense',
  income: 'Income',
};

const initFromDate = `${moment().year()}-0${moment().month() + 1}-01`;
const initToDate = moment().format('YYYY-MM-DD');

function HeaderRightComponent({
  indicatorIndex,
  showMonthYearListMenuHandler,
  year,
  month,
}) {
  const monthName = moment.monthsShort(month - 1);

  return (
    <View>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => showMonthYearListMenuHandler()}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#ffd3d3',
            marginRight: 25,
          }}>
          <Text style={{fontSize: 16, color: '#2a8aff'}}>
            {indicatorIndex !== 0 ? '' : monthName} {year}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const StatsScreen = ({navigation}: Props) => {
  // const navigation = useNavigation();

  const [expenseData, setExpenseData] = useState<ExpenseType>();
  const [incomeData, setIncomeData] = useState<IncomeType>();
  const [showMonthYearListMenu, setShowMonthYearListMenu] =
    useState<boolean>(false);
  const [fromDate, setFromDate] = useState<string | null>(initFromDate);
  const [toDate, setToDate] = useState<string | null>(initToDate);
  const [indicatorIndex, setIndicatorIndex] = useState<number | undefined>(0);
  const [year, setYear] = useState<string | null>(String(moment().year()));
  const [month, setMonth] = useState<number | undefined>(moment().month() + 1);
  // const [duration, setDuration] = useState(moment().year());
  const onItemPress = useCallback((itemIndex: number) => {
    setIndicatorIndex(itemIndex);
    if (itemIndex === 0) {
      // console.log(itemIndex);
      // setFromToDateBudgetHandler();
    }
    if (itemIndex === 1) {
      // console.log(itemIndex);
      setFromToDateExpenseIncomeHandler();
    }
    if (itemIndex === 2) {
      // console.log(itemIndex);
      setFromToDateExpenseIncomeHandler();
    }
  }, []);

  useEffect(() => {
    setExpenseData(EXPENSES);
    setIncomeData(INCOME);
    onMonthYearSelectedHandler(moment().month());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => (
        <HeaderRightComponent
          year={year}
          month={month}
          indicatorIndex={indicatorIndex}
          showMonthYearListMenuHandler={() =>
            setShowMonthYearListMenu(show => !show)
          }
        />
      ),
    });
    if (indicatorIndex === 1 || indicatorIndex === 2) {
      setFromToDateExpenseIncomeHandler();
    }
  }, [navigation, showMonthYearListMenu, year, month, indicatorIndex, ,]);

  if (
    expenseData === null ||
    expenseData === undefined ||
    incomeData === null ||
    incomeData === undefined
  ) {
    return;
  }

  // function setFromToDateBudgetHandler() {
  //   if (month === moment().month() + 1) {
  //     setFromDate(moment().format(`${year}-${`0${month}`}-01`));
  //     setToDate(moment().format(`${year}-${`0${month}`}-DD`));
  //   } else {
  //     const mm = moment().month(month).format('MM');
  //     const days = moment(moment().format(`YYYY-${mm}`)).daysInMonth();
  //     setFromDate(moment().format(`${year}-${mm}-01`));
  //     setToDate(moment().format(`${year}-${mm}-${days}`));
  //   }
  // }

  function setFromToDateExpenseIncomeHandler() {
    if (year === moment().year()) {
      setFromDate(moment().format(`${year}-01-01`));
      setToDate(moment().format(`${year}-MM-DD`));
    } else {
      setFromDate(moment().format(`${year}-01-01`));
      setToDate(moment().format(`${year}-12-31`));
    }
  }

  // Set Month Year
  function onMonthYearSelectedHandler(time) {
    let fromdate;
    let todate;
    let month;
    const mm = moment().month(time).format('MM');
    const daysInMonth = moment(moment().format(`YYYY-${mm}`)).daysInMonth();

    if (indicatorIndex !== 0) {
      fromdate = moment().startOf('year').format(`${time}-01-01`);
      todate = moment().endOf('year').format(`${time}-12-31`);
      month = moment().month() + 1;
      setYear(moment(fromdate)?.year());
    }
    if (indicatorIndex === 0) {
      fromdate = moment(new Date(`${year}-${mm}-01`), 'YYYY-MM-DD');
      todate = moment(new Date(`${year}-${mm}-${daysInMonth}`), 'YYYY-MM-DD');
      month = moment(fromdate).month() + 1;
    }

    setFromDate(fromdate);
    setToDate(todate);
    setMonth(month);
    setShowMonthYearListMenu(false);
  }

  // Filter Expense Data
  const filteredDataExpense = expenseData?.filter(
    d => d.date >= new Date(fromDate) && d.date <= new Date(toDate),
  );
  const sumExpenseByMonthObj = sumByCustomMonth(
    filteredDataExpense,
    'expense',
    fromDate,
    toDate,
  );

  // data for expense line chart
  const filteredDataIncome = incomeData?.filter(
    d => d.date >= new Date(fromDate) && d.date <= new Date(toDate),
  );
  const sumIncomeByMonthObj = sumByCustomMonth(
    filteredDataIncome,
    'income',
    fromDate,
    toDate,
  );

  const renderTabs = () => {
    return (
      <View>
        <Tabs
          TabsDataObject={dataTabsObject}
          onItemPress={onItemPress}
          indicatorIndex={indicatorIndex}
        />
      </View>
    );
  };

  const RenderBudgetsTab = () => {
    return (
      <View style={{flex: 1}}>
        <TimeLineTab
          data={filteredDataExpense}
          fromDate={fromDate}
          toDate={toDate}
        />
      </View>
    );
  };

  const RenderExpenseTab = () => {
    return (
      <View style={{marginTop: 25}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Expense</Text>
        </View>

        <LineChart
          lineChartData={sumExpenseByMonthObj}
          lineChartColor="red"
          circleColor="red"
        />
      </View>
    );
  };

  const RenderIncomeTab = () => {
    return (
      <View style={{marginTop: 25}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Income</Text>
        </View>
        <LineChart
          lineChartData={sumIncomeByMonthObj}
          lineChartColor="#006057"
          circleColor="#006057"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderTabs()}
      {indicatorIndex === 0 && <RenderBudgetsTab />}
      {indicatorIndex === 1 && <RenderExpenseTab />}
      {indicatorIndex === 2 && <RenderIncomeTab />}
      {showMonthYearListMenu && (
        <MonthYearList
          monthlyPressed={indicatorIndex !== 0 ? true : false}
          onMonthYearSelectedHandler={onMonthYearSelectedHandler}
          year={year}
          setYear={setYear}
        />
      )}

      {/* <View style={styles.addButtonContainer}>
        <IconButton
          name="add-outline"
          size={15}
          onPress={() => navigation.navigate('AddExpenses')}
        />
      </View> */}
    </View>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
  },
  addButtonContainer: {
    backgroundColor: '#5ca3f6',
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
    right: 15,
    bottom: 30,
  },
  pressed: {
    opacity: 0.75,
  },
});

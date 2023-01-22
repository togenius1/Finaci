import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';

import TimeLineComponent from '../components/Graph/TimeLineComponent';
import Tabs from '../components/UI/Tabs';
import LineChart from '../components/Graph/LineChart';
import MonthYearList from '../components/Menu/MonthYearList';
import {StatsNavigationProp} from '../types';
import {useAppSelector} from '../hooks';

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
  year,
  month,
  setIsModalVisible,
}: HeaderRight) {
  const monthName = moment.monthsShort(+month - 1);

  return (
    <View>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => setIsModalVisible(true)}>
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
  // const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);
  // const navigation = useNavigation();

  const expenseData = dataLoaded?.expenses?.expenses;
  const monthlyTransactsData = dataLoaded?.monthlyTransacts?.monthlyTransacts;

  // const [expenseData, setExpenseData] = useState<ExpenseType>();
  // const [incomeData, setIncomeData] = useState<IncomeType>();
  // const [showMonthYearListMenu, setShowMonthYearListMenu] =
  //   useState<boolean>(false);
  const [fromDate, setFromDate] = useState<string | null>(initFromDate);
  const [toDate, setToDate] = useState<string | null>(initToDate);
  const [indicatorIndex, setIndicatorIndex] = useState<number | undefined>(0);
  const [year, setYear] = useState<number>(moment().year());
  const [month, setMonth] = useState<number>(moment().month() + 1);
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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
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
          setIsModalVisible={setIsModalVisible}
        />
      ),
    });
    if (indicatorIndex === 1 || indicatorIndex === 2) {
      setFromToDateExpenseIncomeHandler();
    }
  }, [year, month, indicatorIndex]);

  // Filter Expense Data
  const filteredDataExpense = monthlyTransactsData?.filter(
    d => +moment(d?.date).year() === year,
  );

  // data for expense line chart
  const filteredDataIncome = monthlyTransactsData?.filter(
    d => +moment(d?.date).year() === year,
  );

  // Filter Expense Data
  const filteredDataTabExpense = expenseData?.filter(
    d =>
      new Date(d?.date) >= new Date(fromDate) &&
      new Date(d?.date) <= new Date(toDate),
  );

  // Set Month Year
  function onMonthYearSelectedHandler(time) {
    let fromdate;
    let todate;
    let month;
    const mm = moment().month(time).format('MM');
    const daysInMonth = moment(moment().format(`YYYY-${mm}`)).daysInMonth();

    if (indicatorIndex === 1 || indicatorIndex === 2) {
      fromdate = `${year}-01-01`;
      todate = `${year}-12-31`;
      month = moment().month() + 1;
      setYear(time);
    }
    if (indicatorIndex === 0) {
      fromdate = `${year}-${mm}-01`;
      todate = `${year}-${mm}-${daysInMonth}`;
      month = moment(fromdate).month() + 1;
    }

    setFromDate(fromdate);
    setToDate(todate);
    setMonth(mm);
    setIsModalVisible(false);
  }

  function setFromToDateExpenseIncomeHandler() {
    if (year === String(moment().year())) {
      setFromDate(moment().format(`${year}-01-01`));
      setToDate(moment().format(`${year}-MM-DD`));
    } else {
      setFromDate(moment().format(`${year}-01-01`));
      setToDate(moment().format(`${year}-12-31`));
    }
  }

  const RenderTabs = () => {
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
        <TimeLineComponent
          data={filteredDataTabExpense}
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
          type="expense"
          lineChartData={filteredDataExpense}
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
          type="income"
          lineChartData={filteredDataIncome}
          lineChartColor="#006057"
          circleColor="#006057"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <RenderTabs />
      {indicatorIndex === 0 && <RenderBudgetsTab />}
      {indicatorIndex === 1 && <RenderExpenseTab />}
      {indicatorIndex === 2 && <RenderIncomeTab />}

      <MonthYearList
        monthlyPressed={indicatorIndex !== 0 ? true : false}
        onMYSelectedHandler={onMonthYearSelectedHandler}
        year={+year}
        setYear={setYear}
        month={month}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default StatsScreen;

//================================================================
// -------------------------  TYPE ------------------------------
type Props = {
  navigation: StatsNavigationProp;
};

type HeaderRight = {
  indicatorIndex: number;
  year: number;
  month: number;
  setIsModalVisible: (value: boolean) => boolean;
};

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
  // budget: 'Budgets',
  expense: 'Expense',
  income: 'Income',
};

// const initFromDate = `${moment().year()}-${moment().month() + 1}-01`;
const initFromDate = moment().startOf('year').format('YYYY-MM-DD');
const initToDate = moment().format('YYYY-MM-DD');

const HeaderRightComponent = ({
  indicatorIndex,
  year,
  month,
  setIsModalVisible,
}: HeaderRight) => {
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
            {/* {indicatorIndex !== 0 ? '' : monthName} {year} */}
            {year}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const StatsScreen = ({navigation}: Props) => {
  // const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);
  // const navigation = useNavigation();

  const expenseData = dataLoaded?.expenses?.expenses;
  const monthlyTransactsData = dataLoaded?.monthlyTransacts?.monthlyTransacts;

  const [fromDate, setFromDate] = useState<string | null>();
  const [toDate, setToDate] = useState<string | null>(initToDate);
  const [indicatorIndex, setIndicatorIndex] = useState<number | undefined>(0);
  const [year, setYear] = useState<number>(moment().year());
  const [month, setMonth] = useState<number>(moment().month() + 1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // const [duration, setDuration] = useState(moment().year());
  const onItemPress = useCallback((itemIndex: number) => {
    setIndicatorIndex(itemIndex);
    if (itemIndex === 0) {
      setFromToDateExpenseIncomeHandler();
    }
    if (itemIndex === 1) {
      setFromToDateExpenseIncomeHandler();
    }
    if (itemIndex === 2) {
      setFromToDateExpenseIncomeHandler();
    }
  }, []);

  useEffect(() => {
    onMonthYearSelectedHandler(moment().month());
  }, []);

  useEffect(() => {
    setFromToDateExpenseIncomeHandler();
  }, [year]);

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
    expense =>
      moment(expense?.date).format('YYYY-MM-DD') >=
        moment(fromDate).format('YYYY-MM-DD') &&
      moment(expense?.date).format('YYYY-MM-DD') <=
        moment(toDate).format('YYYY-MM-DD'),
  );

  // Set Month Year
  function onMonthYearSelectedHandler(time) {
    let fromdate;
    let todate;
    let month;

    const mm = +moment().month(time).format('MM');
    const daysInMonth = moment(moment().format(`${year}-${mm}`)).daysInMonth();

    if (indicatorIndex === 1 || indicatorIndex === 2) {
      fromdate = moment(`${year}-01-01`).format('YYYY-MM-DD');
      todate = moment(`${year}-12-31`).format('YYYY-MM-DD');
      month = moment().month() + 1;
      setYear(time);
    }
    if (indicatorIndex === 0) {
      fromdate = moment(`${year}-${mm}-01`).format('YYYY-MM-DD');
      todate = moment(`${year}-${mm}-${daysInMonth}`).format('YYYY-MM-DD');
      month = moment(fromdate).month() + 1;
    }

    setFromDate(fromdate);
    setToDate(todate);
    setMonth(mm);
    setIsModalVisible(false);
  }

  function setFromToDateExpenseIncomeHandler() {
    if (year === moment().year()) {
      setFromDate(moment(`${year}-01-01`).format('YYYY-MM-DD'));
      setToDate(moment(`${year}-MM-DD`).format('YYYY-MM-DD'));
    } else {
      setFromDate(moment(`${year}-01-01`).format('YYYY-MM-DD'));
      setToDate(moment(`${year}-12-31`).format('YYYY-MM-DD'));
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
      {/* {indicatorIndex === 0 && <RenderBudgetsTab />} */}
      {indicatorIndex === 0 && <RenderExpenseTab />}
      {indicatorIndex === 1 && <RenderIncomeTab />}

      <MonthYearList
        // monthlyPressed={indicatorIndex !== 0 ? true : false}
        monthlyPressed={true}
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

import {Dimensions, StyleSheet, View} from 'react-native';
import React, {Dispatch, SetStateAction, useCallback, useState} from 'react';
import moment from 'moment';

import TransactionSummary from './TransactionSummary';
import Tabs from '../UI/Tabs';
import {IncomeType} from '../../models/income';
import {ExpenseType} from '../../models/expense';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

type Props = {
  expenseData: ExpenseType | undefined;
  incomeData: IncomeType | undefined;
  setDuration: Dispatcher<string | null>;
  setFromDate: Dispatcher<string | null>;
  setToDate: Dispatcher<string | null>;
  setMonthlyPressed: Dispatcher<boolean>;
  setWeeklyPressed: Dispatcher<boolean>;
  setDailyPressed: Dispatcher<boolean>;
  setCustomPressed: Dispatcher<boolean>;
  fromDate: string;
  toDate: string;
  monthlyPressed: boolean;
  weeklyPressed: boolean;
  dailyPressed: boolean;
  customPressed: boolean;
  year: string;
  month: string;
};

const {width, height} = Dimensions.get('window');

const TabsDataObject = {
  monthly: 'Monthly',
  weekly: 'Weekly',
  daily: 'Daily',
  custom: 'Custom',
  export: 'Export',
};

const TransactionOutput = ({
  expenseData,
  incomeData,
  setDuration,
  setFromDate,
  fromDate,
  setToDate,
  toDate,
  setMonthlyPressed,
  monthlyPressed,
  setWeeklyPressed,
  weeklyPressed,
  dailyPressed,
  setDailyPressed,
  setCustomPressed,
  customPressed,
  year,
  month,
}: Props) => {
  const [exportPressed, setExportPressed] = useState<boolean>(false);
  // const [customPressed, setCustomPressed] = useState(false);
  const [indicatorIndex, setIndicatorIndex] = useState<number | undefined>(0);

  // const navigation = useNavigation();

  const onItemPress = useCallback(
    (itemIndex: number) => {
      setIndicatorIndex(itemIndex);
      if (itemIndex === 0) {
        setMonthlyHandler();
      }
      if (itemIndex === 1) {
        setWeeklyHandler();
      }
      if (itemIndex === 2) {
        setDailyHandler();
      }
      if (itemIndex === 3) {
        setCustomHandler();
      }
      if (itemIndex === 4) {
        exportsHandler();
      }
    },
    [monthlyPressed, weeklyPressed, dailyPressed, customPressed, exportPressed],
  );

  const setMonthlyHandler = () => {
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
    setDuration(String(moment(toDate).year()));
    // setYear(moment(toDate).year());
  };

  const setWeeklyHandler = () => {
    if (+month < 10) {
      month = `0${month}`;
    }
    const date = moment().format(`${year}-${month}-DD`);
    const daysInMonth = moment(
      moment().format(`YYYY-${month}`),
      'YYYY-MM',
    ).daysInMonth();
    const fromdate = moment(`${year}-${month}-01`).format('YYYY-MM-DD');
    const todate = moment(`${year}-${month}-${daysInMonth}`).format(
      'YYYY-MM-DD',
    );

    setFromDate(String(fromdate));
    setToDate(String(todate));
    setDuration(moment.monthsShort(moment(date).month()));
    setMonthlyPressed(false);
    setWeeklyPressed(true);
    setDailyPressed(false);
    setCustomPressed(false);
    setExportPressed(false);
  };

  const setDailyHandler = () => {
    if (+month < 10) {
      month = `0${month}`;
    }
    const date = moment().format(`${year}-${month}-DD`);
    const daysInMonth = moment(
      moment().format(`YYYY-${month}`),
      'YYYY-MM',
    ).daysInMonth();
    const fromdate = moment(`${year}-${month}-01`).format('YYYY-MM-DD');
    const todate = moment(`${year}-${month}-${daysInMonth}`).format(
      'YYYY-MM-DD',
    );

    setFromDate(fromdate);
    setToDate(todate);
    setDuration(moment.monthsShort(moment(date).month()));
    setMonthlyPressed(false);
    setWeeklyPressed(false);
    setDailyPressed(true);
    setCustomPressed(false);
    setExportPressed(false);
  };

  const setCustomHandler = () => {
    if (+month < 10) {
      month = `0${month}`;
    }

    let today = moment().date();
    if (today < 10) {
      today = `0${today}`;
    }

    const fromdate = moment(new Date(`${year}-${month}-01`), 'YYYY-MM-DD');
    const todate = moment(new Date(`${year}-${month}-${today}`), 'YYYY-MM-DD');

    setFromDate(String(fromdate));
    setToDate(String(todate));
    setMonthlyPressed(false);
    setWeeklyPressed(false);
    setDailyPressed(false);
    setCustomPressed(true);
    setExportPressed(false);
  };

  function exportsHandler() {
    setExportPressed(true);
    setMonthlyPressed(false);
    setWeeklyPressed(false);
    setDailyPressed(false);
    setCustomPressed(false);
  }

  return (
    <View style={styles.container}>
      <Tabs
        TabsDataObject={TabsDataObject}
        onItemPress={onItemPress}
        indicatorIndex={indicatorIndex}
      />

      <TransactionSummary
        expenseData={expenseData}
        incomeData={incomeData}
        monthlyPressed={monthlyPressed}
        weeklyPressed={weeklyPressed}
        dailyPressed={dailyPressed}
        customPressed={customPressed}
        fromDate={fromDate}
        toDate={toDate}
        exportPressed={exportPressed}
      />
    </View>
  );
};

export default TransactionOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    padding: 6,
    marginTop: 10,
    width,
    backgroundColor: '#c2fae2',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    top: 40,
    right: 2,
  },

  pressed: {
    opacity: 0.75,
  },
});

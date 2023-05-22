import {Dimensions, StyleSheet, View} from 'react-native';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import moment from 'moment';
import {useInterstitialAd, TestIds} from 'react-native-google-mobile-ads';
// import {useNavigation} from '@react-navigation/native';

import TransactionSummary from './TransactionSummary';
import Tabs from '../UI/Tabs';

const {width} = Dimensions.get('window');
const TabsDataObject = {
  monthly: 'Monthly',
  weekly: 'Weekly',
  daily: 'Daily',
  custom: 'Custom',
  export: 'Export',
};

// Ads variable
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-3212728042764573~3355076099';

const TransactionOutput = ({
  setDuration,
  duration,
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
  setIndicatorIndex,
  indicatorIndex,
  setExportPressed,
  exportPressed,
}: // monthlyTransactions,
// weeklyTransactions,
// dailyTransactions,
Props) => {
  // const [customPressed, setCustomPressed] = useState(false);

  // const navigation = useNavigation();

  const {isLoaded, isClosed, load, show} = useInterstitialAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  // Load ads
  useEffect(() => {
    // Start loading the interstitial straight away
    load();
  }, [load]);

  // Load ads again
  useEffect(() => {
    if (isClosed) {
      // console.log('Reloading ad...');
      load();
    }
  }, [isClosed]);

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
    [monthlyPressed, weeklyPressed, dailyPressed, customPressed, exportPressed],
  );

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

  console.log('duration: ', duration);
  console.log('typeof duration: ', typeof duration);

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
    setDuration(moment.monthsShort(moment(date).month()));

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
    setDuration(moment.monthsShort(moment(date).month()));
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

  function exportsHandler() {
    setExportPressed(true);
    setMonthlyPressed(false);
    setWeeklyPressed(false);
    setDailyPressed(false);
    setCustomPressed(false);

    // show Ads
    if (isLoaded) {
      show();
    }
  }

  return (
    <View style={styles.container}>
      <Tabs
        TabsDataObject={TabsDataObject}
        onItemPress={onItemPress}
        indicatorIndex={indicatorIndex}
      />

      <TransactionSummary
        monthlyPressed={monthlyPressed}
        weeklyPressed={weeklyPressed}
        dailyPressed={dailyPressed}
        customPressed={customPressed}
        fromDate={fromDate}
        toDate={toDate}
        exportPressed={exportPressed}
        year={year}
        setIndicatorIndex={setIndicatorIndex}
      />
    </View>
  );
};

export default TransactionOutput;

// Style
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

//============================= TYPE ===================================
type Dispatcher<S> = Dispatch<SetStateAction<S>>;

type Props = {
  setDuration: Dispatch<SetStateAction<string | null | undefined>>;
  setFromDate: Dispatch<React.SetStateAction<string | null>>;
  setToDate: Dispatcher<string | null>;
  setMonthlyPressed: Dispatch<SetStateAction<boolean>>;
  setWeeklyPressed: Dispatch<SetStateAction<boolean>>;
  setDailyPressed: Dispatch<SetStateAction<boolean>>;
  setCustomPressed: Dispatch<SetStateAction<boolean>>;
  setIndicatorIndex: Dispatch<React.SetStateAction<number | undefined>>;
  setExportPressed: React.Dispatch<React.SetStateAction<boolean>>;
  setYear: (value: number) => void;
  duration: any;
  fromDate: string | null;
  toDate: string | null;
  monthlyPressed: boolean;
  weeklyPressed: boolean;
  dailyPressed: boolean;
  customPressed: boolean;
  exportPressed: boolean;
  indicatorIndex: number | undefined;
  year: string;
  month: string;
};

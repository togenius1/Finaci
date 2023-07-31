import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import moment from 'moment';

import BarchartTab from './BarChartTab';
import {useAppSelector} from '../../hooks';
import OverviewContext from '../../store-context/overview-context';

const SpendingTab = ({}) => {
  const dataLoaded = useAppSelector(store => store);

  const expenseData = dataLoaded?.expenses?.expenses;

  const overviewCtx = useContext(OverviewContext);
  const fromDate = overviewCtx?.fromDate;
  const toDate = overviewCtx?.toDate;

  const filteredData = expenseData?.filter(
    d =>
      moment(d.date).format('YYYY-MM-DD') >=
        moment(fromDate).format('YYYY-MM-DD') &&
      moment(d.date).format('YYYY-MM-DD') <=
        moment(toDate).format('YYYY-MM-DD'),
  );
  // }

  return (
    <View style={styles.container}>
      <BarchartTab data={filteredData} fromDate={fromDate} toDate={toDate} />
    </View>
  );
};

export default SpendingTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});

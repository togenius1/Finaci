import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
// import {useNavigation} from '@react-navigation/native';
// import {v4 as uuidv4} from 'uuid';
// import moment from 'moment';

import OverviewList from './ExpenseList';
import PieChart from '../Graph/PieChart';
import {
  calPctEachCategoryId,
  sumTotalFunc,
  sumEachCategoryId,
} from '../../util/math';
// import IconButton from '../UI/iconButton';
import {ExpenseCategory} from '../../dummy/categoryItems';
import {useAppSelector} from '../../hooks';

type Props = {
  // data: any;
  fromDate: string;
  toDate: string;
};

const {height} = Dimensions.get('window');

const ExpenseOutput = ({fromDate, toDate}: Props) => {
  // const navigation = useNavigation();

  const dataLoaded = useAppSelector(store => store);

  const data = dataLoaded?.expenses?.expenses;

  // if (focusedTabIndex === 1) {
  const filteredData = data.filter(
    d =>
      moment(d.date).format('YYYY-MM-DD') >=
        moment(fromDate).format('YYYY-MM-DD') &&
      moment(d.date).format('YYYY-MM-DD') <=
        moment(toDate).format('YYYY-MM-DD'),
  );
  // Summation for each category
  const sumEachCateObj = sumEachCategoryId(filteredData);
  const totalAmount = sumTotalFunc(sumEachCateObj);
  const pctEachCateObj = calPctEachCategoryId(
    sumEachCateObj,
    totalAmount,
    ExpenseCategory,
  );
  //sort Data
  pctEachCateObj.sort((a: any, b: any) => {
    const amountA = a.percentage.valueOf();
    const amountB = b.percentage.valueOf();

    if (amountA > amountB) {
      return -1; // return -1 here for DESC order
    }
    return 1; // return 1 here for DESC Order
  });
  // }

  return (
    <View style={styles.container}>
      {/* Pie chart */}
      <View style={styles.pieChart}>
        <PieChart data={pctEachCateObj} type="expense" />
      </View>
      {/* Summary Category List */}
      <View style={styles.transactContainer}>
        <OverviewList data={pctEachCateObj} />
      </View>
    </View>
  );
};

export default ExpenseOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transactContainer: {
    height: height / 2.5,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#ffffff',
  },
  pieChart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
});

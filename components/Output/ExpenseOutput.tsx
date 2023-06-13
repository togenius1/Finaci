import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
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

type Props = {};

const {width, height} = Dimensions.get('window');

const ExpenseOutput = ({data, fromDate, toDate}: Props) => {
  const navigation = useNavigation();

  // filter data: from date --> to date
  const filteredData = data.filter(
    d =>
      new Date(d.date) >= new Date(fromDate) &&
      new Date(d.date) <= new Date(toDate),
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
  // addButtonContainer: {
  //   backgroundColor: '#5ca3f6',
  //   width: width * 0.15,
  //   height: width * 0.15,
  //   borderRadius: (width * 0.2) / 2,
  //   borderWidth: 0.5,
  //   borderColor: '#fff',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   shadowOffset: {width: 0, height: 0},
  //   shadowOpacity: 0.7,
  //   shadowRadius: 3,
  //   elevation: 3,

  //   position: 'absolute',
  //   right: 20,
  //   bottom: 30,
  // },
});

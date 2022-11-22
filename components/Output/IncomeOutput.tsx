import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
// import {v4 as uuidv4} from 'uuid';

import PieChart from '../Graph/PieChart';
import {
  calPctEachCategoryId,
  sumTotalFunc,
  sumEachCategoryId,
} from '../../util/math';
import IconButton from '../UI/iconButton';
import IncomeList from './IncomeList';
import {IncomeCategory} from '../../dummy/categoryItems';

type Props = {};

const {width} = Dimensions.get('window');

const IncomeOutput = ({data, fromDate, toDate}: Props) => {
  // let slices = [];
  // const incomeData = data;
  const navigation = useNavigation();

  // Filtered data: from date -to- to date
  const filteredData = data.filter(
    d => d.date >= new Date(fromDate) && d.date <= new Date(toDate),
  );

  // Summation for each category
  const sumEachCateObj = sumEachCategoryId(filteredData);
  const totalAmount = sumTotalFunc(sumEachCateObj);
  const pctEachCateObj = calPctEachCategoryId(
    sumEachCateObj,
    totalAmount,
    IncomeCategory,
  );

  //sort Data
  pctEachCateObj.sort((a: any, b: any) => {
    const amountA = a.percentage;
    const amountB = b.percentage;
    if (amountA > amountB) {
      return -1; // return -1 here for DESC order
    }
    return 1; // return 1 here for DESC Order
  });

  return (
    <View style={styles.container}>
      {/* Pie chart */}
      <View style={styles.pieChart}>
        <PieChart data={pctEachCateObj} type="income" />
      </View>
      {/* Summary Category List */}
      <View style={styles.transactContainer}>
        <IncomeList data={pctEachCateObj} />
      </View>

      <View style={styles.addButtonContainer}>
        <IconButton
          name="remove-outline"
          size={15}
          onPress={() => navigation.navigate('AddExpenses')}
        />
      </View>
    </View>
  );
};

export default IncomeOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transactContainer: {
    height: 250,
    marginTop: 10,
    marginBottom: 100,
    backgroundColor: '#ffffff',
  },
  pieChart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  addButtonContainer: {
    backgroundColor: '#5ca3f6',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.2) / 2,
    borderWidth: 0.5,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 3,

    position: 'absolute',
    right: 20,
    bottom: 30,
  },
});

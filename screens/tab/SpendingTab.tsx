import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
// import moment from 'moment';

import {EXPENSES} from '../../dummy/dummy';
import BarchartTab from '../screenComponents/BarChartTab';
import IconButton from '../../components/UI/iconButton';
// import {sumByCustomDate, sumByDate} from '../../util/math';
import {SpendingTabRouteProp} from '../../types';
import {ExpenseType} from '../../models/expense';

type Props = {
  route: SpendingTabRouteProp;
};

const {width} = Dimensions.get('window');

const SpendingTab = ({route}: Props) => {
  const [expenseData, setExpenseData] = useState<ExpenseType>();

  const navigation = useNavigation();

  const fromDate = route.params?.fromDate;
  const toDate = route.params?.toDate;

  useEffect(() => {
    setExpenseData(EXPENSES);
  }, []);

  if (expenseData === null || expenseData === undefined) {
    return;
  }

  const filteredData = expenseData?.filter(
    d => d.date >= new Date(fromDate) && d.date <= new Date(toDate),
  );

  const RenderBarchartTab = () => {
    return (
      <BarchartTab data={filteredData} fromDate={fromDate} toDate={toDate} />
    );
  };

  return (
    <View style={styles.container}>
      {/* {renderBarchartTab()} */}
      <RenderBarchartTab />

      <View style={styles.addButtonContainer}>
        <IconButton
          name="add"
          size={30}
          color="white"
          onPress={() => navigation.navigate('AddExpenses')}
        />
      </View>
    </View>
  );
};

export default SpendingTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  pressed: {
    opacity: 0.75,
  },
});

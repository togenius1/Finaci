import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

import {EXPENSES} from '../../dummy/dummy';
import BarchartTab from '../screenComponents/BarChartTab';
import IconButton from '../../components/UI/iconButton';
import {sumByCustomDate, sumByDate} from '../../util/math';

type Props = {};

const Spending = ({route}: Props) => {
  const [expenseData, setExpenseData] = useState();

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

  const renderBarchartTab = () => {
    return (
      <BarchartTab data={filteredData} fromDate={fromDate} toDate={toDate} />
    );
  };

  return (
    <View style={styles.container}>
      {renderBarchartTab()}
      <View style={styles.addButtonContainer}>
        <IconButton
          name="add-outline"
          size={15}
          onPress={() => navigation.navigate('AddExpenses')}
        />
      </View>
    </View>
  );
};

export default Spending;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    right: 20,
    bottom: 50,
  },
  pressed: {
    opacity: 0.75,
  },
});

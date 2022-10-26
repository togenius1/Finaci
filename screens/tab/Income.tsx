import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';

import IncomeOutput from '../../components/Output/IncomeOutput';
import {INCOME} from '../../dummy/dummy';

type Props = {};

const Income = ({route}: Props) => {
  const [incomeData, setIncomeData] = useState();

  const isFocused = useIsFocused();
  const fromDate = route.params?.fromDate;
  const toDate = route.params?.toDate;

  useEffect(() => {}, [route.params]);

  useEffect(() => {
    setIncomeData(INCOME);
  }, []);

  if (incomeData === null || incomeData === undefined) {
    return;
  }

  return (
    // isFocused && (
    <IncomeOutput data={incomeData} fromDate={fromDate} toDate={toDate} />
    // )
  );
};

export default Income;

const styles = StyleSheet.create({});

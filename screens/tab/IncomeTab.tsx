import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
// import {useIsFocused} from '@react-navigation/native';

import IncomeOutput from '../../components/Output/IncomeOutput';
import {INCOME} from '../../dummy/dummy';
import {IncomeTabRouteProp} from '../../types';
import {IncomeType} from '../../models/income';

type Props = {
  route: IncomeTabRouteProp;
};

const IncomeTab = ({route}: Props) => {
  const [incomeData, setIncomeData] = useState<IncomeType>();

  // const isFocused = useIsFocused();
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

export default IncomeTab;

const styles = StyleSheet.create({});

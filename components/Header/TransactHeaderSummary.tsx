import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {currencyFormatter} from '../../util/currencyFormatter';

const {width, height} = Dimensions.get('window');

const TransactHeaderSummary = ({total, totalIncome, totalExpense}: Props) => {
  return (
    <View style={styles.assetsContainer}>
      <View style={styles.assetBox}>
        <Text style={{fontSize: height * 0.015}}>Income</Text>
        <Text
          style={{color: 'blue', fontSize: height * 0.018, fontWeight: 'bold'}}>
          {currencyFormatter(+totalIncome, {})}
        </Text>
      </View>
      <View style={styles.assetBox}>
        <Text style={{fontSize: height * 0.015}}>Expense</Text>
        <Text
          style={{color: 'red', fontSize: height * 0.018, fontWeight: 'bold'}}>
          {currencyFormatter(+totalExpense, {})}
        </Text>
      </View>
      <View style={styles.assetBox}>
        <Text style={{fontSize: height * 0.015}}>Total</Text>
        <Text style={{fontSize: height * 0.018, fontWeight: 'bold'}}>
          {currencyFormatter(+total, {})}
        </Text>
      </View>
    </View>
  );
};

export default TransactHeaderSummary;

const styles = StyleSheet.create({
  assetsContainer: {
    width: width,
    height: height * 0.07,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Platform.OS === 'android' ? height * 0.075 : height * 0.065,

    backgroundColor: 'white',
    borderColor: '#b8b8b8',
    borderBottomWidth: 0.4,

    position: 'absolute',
    // backgroundColor: 'red',
  },
  assetBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ============================ TYPE =====================================
type Props = {
  total: number;
  totalIncome: number;
  totalExpense: number;
};

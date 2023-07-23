import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {currencyFormatter} from '../util/currencyFormatter';

type Props = {
  totalAssets: number | undefined;
  totalExpenses: number | undefined;
  total: number | undefined;
};

const {width, height} = Dimensions.get('window');

const AccountHeader = ({totalAssets, totalExpenses, total}: Props) => {
  return (
    <View style={styles.assetsContainer}>
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Assets</Text>
        <Text style={[styles.headerValueText, {color: 'blue'}]}>
          {currencyFormatter(+totalAssets, {})}
        </Text>
      </View>

      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Liabilities</Text>
        <Text style={[styles.headerValueText, {color: 'red'}]}>
          {currencyFormatter(Number(totalExpenses), {})}
        </Text>
      </View>

      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Total</Text>
        <Text style={styles.headerValueText}>
          {currencyFormatter(+total, {})}
        </Text>
      </View>
    </View>
  );
};

export default AccountHeader;

const styles = StyleSheet.create({
  assetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    // backgroundColor: 'grey',
  },
  headerBox: {
    // backgroundColor: '#d2cfcf',
    width: (width * 0.85) / 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    // alignSelf: 'center',
    fontSize: width * 0.036,
  },
  headerValueText: {
    // alignSelf: 'center',
    fontSize: width * 0.036,
    marginTop: height * 0.01,
  },
});

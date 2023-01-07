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
          {currencyFormatter(+totalExpenses, {})}
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
  },
  item: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderColor: 'lightgrey',
    borderWidth: 0.5,
  },
  accountsContainer: {
    width,
    height: height * 0.55,
    marginTop: 20,
    // backgroundColor: 'red',
  },
  headerBox: {
    // backgroundColor: 'red',
    width: (width * 0.8) / 4,
    alignSelf: 'center',
  },
  headerText: {
    alignSelf: 'center',
    fontSize: 14,
  },
  headerValueText: {
    alignSelf: 'center',
    fontSize: 15,
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 5,
  },
  accounts: {
    marginBottom: 50,
  },
});

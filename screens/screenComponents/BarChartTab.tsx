import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {max, sum} from 'd3-array';
import {v4 as uuidv4} from 'uuid';

import BarChart from '../../components/Graph/BarChart';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {sumByDate, sumEachAccountId} from '../../util/math';
import {currencyFormatter} from '../../util/currencyFormatter';
// import {AccountCategory} from '../../dummy/account';

type Props = {
  fromDate: string;
};

const BarchartTab = ({data, fromDate}: Props) => {
  const dataLoaded = useAppSelector(store => store);

  const accounts = dataLoaded?.accounts?.accounts;
  const cashAccounts = dataLoaded?.cashAccounts?.cashAccounts;

  // sum expense in the same day --> to barchart
  const sumByDateObj = sumByDate(data, 'expense', moment(fromDate));

  const totalCashAmount = sum(cashAccounts, d => parseFloat(d.budget));
  const totalAccountAmount = sum(accounts, d => parseFloat(d.budget));
  const totalBudget = totalCashAmount + totalAccountAmount;
  const totalExp = sum(data, d => parseFloat(d.amount));

  const leftToSpend = (+totalBudget - +totalExp).toFixed(2);
  const totalExpenses = +totalExp.toFixed(2);
  const dayLeft = +moment().daysInMonth() - moment().date();

  // console.log(leftToSpend);

  let budgetPerDay;
  if (dayLeft === 0) {
    budgetPerDay = 0;
  } else {
    budgetPerDay = (+leftToSpend / dayLeft).toFixed(2);
  }

  return (
    <View>
      <View style={styles.summary}>
        <Text style={{fontSize: 28, fontWeight: 'bold', color: 'green'}}>
          {currencyFormatter(+leftToSpend, {})}
        </Text>
        <Text style={{fontSize: 14, color: 'green'}}>left to spend</Text>
      </View>
      <View style={styles.expenseContainer}>
        <View style={styles.spentContainer}>
          <View style={styles.spent}>
            <View style={{marginTop: -20}}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', color: '#d10000'}}>
                {currencyFormatter(+totalExpenses, {})}
              </Text>
            </View>
            <Text style={{fontSize: 12, color: '#d10000'}}>Spent</Text>
          </View>
          <View style={styles.available}>
            <View style={{marginTop: -20}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'green'}}>
                {currencyFormatter(+budgetPerDay, {})}
              </Text>
            </View>
            <View>
              <Text style={{fontSize: 12, color: 'green'}}>Left per day</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '95%',
            height: 200,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderRadius: 5,
            borderColor: '#c2c2c2',
            position: 'absolute',
            top: 20,
          }}>
          <BarChart data={sumByDateObj} />
        </View>
      </View>
    </View>
  );
};

export default BarchartTab;

const styles = StyleSheet.create({
  summary: {
    // backgroundColor: '#d3f6d3',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 25,
    marginBottom: 20,
  },
  expenseContainer: {
    width: '100%',
    // height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#ffffff',
    marginTop: 20,
  },
  spentContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '90%',
    marginBottom: 240,
  },
  spent: {
    // backgroundColor: '#dbd7d7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  available: {
    // backgroundColor: '#dbd7d7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

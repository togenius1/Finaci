import React, {useState} from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import {scaleTime} from 'd3-scale';
import {currencyFormatter} from '../../util/currencyFormatter';
// import {max, sum} from 'd3-array';

type Props = {};

const {width, height} = Dimensions.get('window');
const barSpan = width * 0.85;

const TimeLine = ({
  item,
  widthBar,
  barColor,
  totalExpense,
  titleStyle,
  budgetStyle,
}: Props) => {
  // const maxExp = max(data, d => parseFloat(d.amount));

  const timeRamp = scaleTime().domain([0, item.budget]).range([0, barSpan]);

  const budget = currencyFormatter(+item?.budget, {});
  const spent = currencyFormatter(+totalExpense, {});
  const budgetLeft = currencyFormatter(+item.budget - +totalExpense, {});

  return (
    <View style={styles.container}>
      {/* BUDGET */}
      <View style={styles.budget}>
        <Text style={titleStyle}>{item.title}</Text>
        <Text
          style={[styles.budgetText, budgetStyle]}>{`${budget} budgets`}</Text>
      </View>
      {/* Remain Budget Bar */}
      <View
        style={{
          backgroundColor: barColor.remain,
          height: widthBar,
          width: timeRamp(totalExpense),
          marginLeft: -timeRamp(item.budget - totalExpense),
        }}
      />
      {/* USED Budget Bar */}
      <View
        style={{
          backgroundColor: barColor.used,
          height: widthBar,
          width: timeRamp(+item.budget - totalExpense),
          marginLeft: timeRamp(totalExpense),
          marginTop: -widthBar,
          opacity: 0.75,
        }}
      />
      {/* BUDGET Available */}
      <View
        style={{
          //   backgroundColor: '#e5e5e5',
          alignItems: 'center',
          marginTop: 8,
          marginRight: timeRamp(item.budget - totalExpense),
        }}></View>
      <View
        style={{
          width: barSpan,
          flexDirection: 'row',
          justifyContent: 'space-between',
          // backgroundColor: '#edc1c1',
        }}>
        <Text style={styles.spentText}>{`${spent}`}</Text>
        {/* Available */}
        <Text style={styles.leftText}>{`${budgetLeft} left`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  budget: {
    width: barSpan,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 5,
    // backgroundColor: '#e5e5e5',
  },
  spentText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#9a0040',
  },
  budgetText: {
    fontSize: 14,
    color: '#424242',
  },
  leftText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#014f8a',
  },
});

export default TimeLine;

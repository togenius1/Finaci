import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {currencyFormatter} from '../../util/currencyFormatter';
// import OverviewItem from './OverviewItem';

type Props = {};

function renderExpenseItem(itemData) {
  return (
    <Pressable
      style={({pressed}) => pressed && styles.pressed}
      onPress={() => {}}>
      <View style={styles.transactBox}>
        <View style={styles.textLeftBox}>
          <View style={styles.pctBox}>
            <Text>{(itemData.item.percentage * 100).toFixed(0)} %</Text>
          </View>
          <View style={styles.cateBox}>
            <Text style={styles.cateText}>{itemData.item.title}</Text>
          </View>
        </View>
        <Text> {currencyFormatter(itemData.item.amount, {})}</Text>
      </View>
    </Pressable>
  );
}

const ExpenseList = ({data}: Props) => {
  return (
    <FlatList
      keyExtractor={item => item.id}
      bounces={false}
      data={data}
      renderItem={renderExpenseItem}
    />
  );
};

export default ExpenseList;

const styles = StyleSheet.create({
  transactBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 15,
    marginRight: 20,
    borderBottomWidth: 0.5,
    borderColor: '#c2c2c2',
  },
  textLeftBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pctBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff9924',
    width: 40,
    height: 25,
  },
  cateBox: {
    marginLeft: 15,
  },
  cateText: {
    fontSize: 14,
  },
  pressed: {
    opacity: 0.75,
  },
});

import React, {useEffect, useState} from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import moment from 'moment';

import {xport} from '../../util/xport';
import {useAppSelector} from '../../hooks';

const {width} = Dimensions.get('window');

const Export = () => {
  // const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const [jsonData, setJsonData] = useState();
  const [newJson, setNewJson] = useState();

  useEffect(() => {
    createNewObject();
  }, [jsonData]);

  // Export format.
  const createNewObject = () => {

    const obj = dataLoaded?.expenses?.expenses?.map((expense, index) => {
      // income
      const incomeObj = dataLoaded?.incomes.incomes?.find(
        income =>
          moment(income.date).format('YYYY-MM-DD') ===
          moment(expense.date).format('YYYY-MM-DD'),
      );

      let incomeAccountObj;
      const incomeCateObj =
        dataLoaded?.incomeCategories?.incomeCategories?.find(
          cate => cate.id === incomeObj?.cateId,
        );

      incomeAccountObj = dataLoaded?.cashAccounts?.cashAccounts?.find(
        cash => cash.id === incomeObj?.accountId,
      );
      if (incomeAccountObj === undefined) {
        incomeAccountObj = dataLoaded?.accounts?.accounts?.find(
          account => account?.id === incomeObj?.accountId,
        );
      }

      // expense
      let expenseAccountObj;
      const expenseCateObj =
        dataLoaded?.expenseCategories?.expenseCategories?.find(
          cate => cate.id === expense?.cateId,
        );

      expenseAccountObj = dataLoaded?.cashAccounts?.cashAccounts?.find(
        cate => cate.id === expense?.accountId,
      );
      if (expenseAccountObj === undefined) {
        expenseAccountObj = dataLoaded?.accounts?.accounts?.find(
          cate => cate?.id === expense?.accountId,
        );
      }

      return {
        No: index + 1,
        Expense_Account: expenseAccountObj?.title,
        Expense: expense?.amount,
        Expense_Category: expenseCateObj?.title,
        Expense_Note: expense?.note,
        Expense_Date: moment(expense?.date).format('YYYY-MM-DD HH:mm:ss'),
        '': '',
        Income_Account: incomeAccountObj?.title,
        Income: incomeObj?.amount,
        Income_Category: incomeCateObj?.title,
        Income_Note: incomeObj?.note,
        Income_Date: moment(incomeObj?.date).format('YYYY-MM-DD HH:mm:ss'),
      };
    });
    setNewJson(obj);
  };

  // Export
  const exportHandler = async (data: {}) => {
    await xport(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
            Export <Text style={{fontSize: 12}}>(Raw data)</Text>
          </Text>
        </View>

        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => exportHandler(newJson)}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18}}>Excel (.xls)</Text>
            <Text style={{fontSize: 14}}>
              Export your data via the .xls files
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Export;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    width,
    height: 100,
    elevation: 3,
    shadowColor: '#c6c6c6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  inner: {
    marginLeft: 20,
  },
  exportsContainer: {
    marginLeft: 20,
    marginTop: 50,
  },
  pressed: {
    opacity: 0.75,
  },
});

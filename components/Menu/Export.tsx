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
    console.log('obj ---> ', dataLoaded?.expenses.expenses);
    
    const obj = dataLoaded?.expenses.expenses?.map((expense, index) => {
      let accountObj;
      const expenseObj = dataLoaded?.expenseCategories?.expenseCategories?.find(
        cate => cate.id === expense.cateId,
      );

      accountObj = dataLoaded?.cashAccounts?.cashAccounts?.find(
        cate => cate.id === expense.accountId,
      );
      if (accountObj === undefined) {
        accountObj = dataLoaded?.accounts?.accounts?.find(
          cate => cate?.id === expense?.accountId,
        );
      }
      return {
        No: index + 1,
        Account: accountObj?.title,
        Expense: expense.amount,
        Category: expenseObj?.title,
        Date: moment(expense?.date).format('YYYY-MM-DD'),
        Note: expense?.note,
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

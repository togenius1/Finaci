import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import moment from 'moment';

import {
  AccountCategory,
  CashCategory,
  ExpenseCategory,
} from '../../../dummy/categoryItems';
import {EXPENSES} from '../../../dummy/dummy';
import {xport} from '../../../util/xport';

const Export = () => {
  const [jsonData, setJsonData] = useState();
  const [newJson, setNewJson] = useState();

  useEffect(() => {
    setJsonData(EXPENSES);
  }, []);

  useEffect(() => {
    createNewObject();
  }, [jsonData]);

  // Export format.
  const createNewObject = () => {
    const obj = jsonData?.map((json, index) => {
      let accountObj;
      const expenseObj = ExpenseCategory.find(cate => cate.id === json.cateId);
      accountObj = CashCategory.find(cate => cate.id === json.accountId);
      if (accountObj === undefined) {
        accountObj = AccountCategory.find(cate => cate.id === json.accountId);
      }
      return {
        No: index + 1,
        Account: accountObj?.title,
        Amount: json.amount,
        Category: expenseObj?.title,
        Date: moment(json?.date).format('YYYY-MM-DD'),
        Note: json?.note,
      };
    });
    setNewJson(obj);
  };

  // Export
  const exportHandler = (data: {}) => {
    xport(data);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => {}}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
          Export <Text style={{fontSize: 12}}>(Raw data)</Text>
        </Text>
      </Pressable>

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
  );
};

export default Export;

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginTop: 50,
  },
  exportsContainer: {
    marginLeft: 20,
    marginTop: 50,
  },
  pressed: {
    opacity: 0.75,
  },
});

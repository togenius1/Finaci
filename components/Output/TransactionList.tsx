import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

type Props = {};

// type FormFields = {
//   amount: string;
//   category: string;
//   note: string;
//   date: string;
//   account: string;
//   [key: string]: any;
// };

const TransactionList = ({expenseData, expenseCateData, accountsData}: Props) => {
  const navigation = useNavigation();

  const renderItemAmount = ({item}) => {
    const categories = expenseCateData.find(cat => cat.id === item.cateId);
    const accounts = accountsData.find(acc => acc.id === item.accountId);

    return (
      <Pressable
        style={({pressed}) =>
          pressed ? [styles.expense, styles.pressed] : styles.expense
        }
        onPress={() => {
          navigation.navigate('AddDetails', {
            amount: item.amount,
            category: categories.title,
            note: item.note,
            date: moment(item.date).format('YYYY-MM-DD'),
            account: accounts.title,
          });
        }}>
        <View style={{justifyContent: 'center'}}>
          <Text style={{fontSize: 14}}>{categories.title}</Text>
        </View>
        <View>
          <Text style={{fontSize: 14, marginBottom: 10}}>{item.amount}</Text>
          <Text style={{color: 'grey'}}>
            {moment(item.date).format('YYYY-MM-DD')}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{flexDirection: 'row', flex: 1}}>
      <FlatList
        keyExtractor={item => item.id + uuidv4()}
        data={expenseData}
        renderItem={renderItemAmount}
        bounces={false}
      />
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  expense: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 5,
    backgroundColor: 'white',
    borderBottomColor: '#b3b3b3',
    borderBottomWidth: 1,
  },
  pressed: {
    opacity: 0.65,
  },
});

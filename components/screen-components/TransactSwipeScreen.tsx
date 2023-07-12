import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

interface Account {
  accountNumber: string;
  balance: number;
}

const accounts: Account[] = [
  {accountNumber: '1', balance: 10},
  {accountNumber: '2', balance: 15},
  {accountNumber: '3', balance: 20},
];

const TransactSwipeScreen = (props: Account) => {
  const accountScreens = {};

  return (
    <View>
      <Text>This is an Account</Text>
      <Text>Account Number: {props.accountNumber}</Text>
      <Text>Balance: £{(props.balance / 100).toFixed(2)}</Text>
    </View>
  );
};

let screens = accounts.map(e => {
  screen: props => <TransactSwipeScreen account={e} {...props} />;
});

export default AccountNavigator = createMaterialTopTabNavigator({...screens});

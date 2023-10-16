import {Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import TransactionsScreen from '../screens/TransactionsScreen';
import ExpensesDetailsScreen from '../screens/ExpensesDetailsScreen';
import IncomesDetailsScreen from '../screens/IncomesDetailsScreen';
import {RootStackParamList} from '../types';

type Props = {};
const {width, height} = Dimensions.get('window');

const Stack = createNativeStackNavigator<RootStackParamList>();

const TransactionStack = (props: Props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={() => ({
          title: 'Transactions',
        })}
      />
      <Stack.Screen
        name="ExpensesDetails"
        component={ExpensesDetailsScreen}
        options={() => ({
          title: 'ExpensesDetails',
          // headerShown: true,
          headerLeft: () => null,
        })}
      />
      <Stack.Screen
        name="IncomesDetails"
        component={IncomesDetailsScreen}
        options={() => ({
          title: 'IncomesDetails',
          // headerShown: true,
          headerLeft: () => null,
        })}
      />
    </Stack.Navigator>
  );
};

export default TransactionStack;

const styles = StyleSheet.create({
  headerLeft: {
    justifyContent: 'flex-start',
    marginRight: width * 0.6,
    width: width * 0.07,
    marginTop: height * 0.025,
    backgroundColor: '#fed8d8',
  },
  pressed: {
    opacity: 0.65,
  },
});

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddExpensesScreen from '../screens/AddExpensesScreen';
import AddDetailsScreen from '../screens/AddDetailsScreen';

import {GlobalStyles} from '../constants/styles';
import {RootStackParamList} from '../types';
import AccountsItem from '../screens/AccountsItem';
import RootNavigator from './RootNavigator';
import MenuDrawer from './NavComponents/Drawer/MenuDrawer';

type Props = {
  isAuthenticated: boolean | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const FinnerNavigator = ({isAuthenticated}: Props) => {
  return (
    <>
      {isAuthenticated ? (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {backgroundColor: GlobalStyles.colors.primary500},
              headerTintColor: 'black',
            }}>
            <Stack.Screen
              name="Menu"
              component={MenuDrawer}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AddExpenses"
              component={AddExpensesScreen}
              options={{
                title: 'Amount',
              }}
            />
            <Stack.Screen name="AddDetails" component={AddDetailsScreen} />
            <Stack.Screen name="AccountsItem" component={AccountsItem} />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <RootNavigator />
      )}
    </>
  );
};

export default FinnerNavigator;

import React from 'react';
import {ColorSchemeName} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddExpensesScreen from '../screens/AddExpensesScreen';
import AddDetailsScreen from '../screens/AddDetailsScreen';

import {GlobalStyles} from '../constants/styles';
import {RootStackParamList} from '../types';
// import AccountsItem from '../components/Output/AccountsItem';
import RootNavigator from './RootNavigator';
import MenuDrawer from './NavComponents/Drawer/MenuDrawer';
import ExpensesDetailsScreen from '../screens/ExpensesDetailsScreen';
import IncomesDetailsScreen from '../screens/IncomesDetailsScreen';
import SignInScreen from './NavComponents/Login/screens/SignInScreen';
import SignUpScreen from './NavComponents/Login/screens/SignUpScreen';
import ConfirmEmailScreen from './NavComponents/Login/screens/ConfirmEmailScreen';
import NewPasswordScreen from './NavComponents/Login/screens/NewPasswordScreen';
import ForgotPasswordScreen from './NavComponents/Login/screens/ForgotPasswordScreen';

type Props = {
  // isAuthenticated: boolean | undefined;
  // colorScheme: ColorSchemeName;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const FinnerNavigator = ({}: Props) => {
  // const MyTheme = {
  //   dark: false,
  //   colors: {
  //     primary: 'rgb(255, 45, 85)',
  //     background: 'rgb(242, 242, 242)',
  //     card: 'rgb(255, 255, 255)',
  //     text: 'rgb(28, 28, 30)',
  //     border: 'rgb(199, 199, 204)',
  //     notification: 'rgb(255, 69, 58)',
  //   },
  // };

  return (
    <>
      {/* {isAuthenticated ? ( */}
      <NavigationContainer
      // theme={colorScheme === 'dark' ? MyTheme : DefaultTheme}
      >
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
          {/* <Stack.Screen name="AccountsItem" component={AccountsItem} /> */}
          <Stack.Screen
            name="ExpensesDetails"
            component={ExpensesDetailsScreen}
          />
          <Stack.Screen
            name="IncomesDetails"
            component={IncomesDetailsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* ) : (
        <RootNavigator />
      )} */}
    </>
  );
};

export default FinnerNavigator;

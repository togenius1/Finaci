import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignInScreen from './NavComponents/Login/screens/SignInScreen';
import SignUpScreen from './NavComponents/Login/screens/SignUpScreen';
import ConfirmEmailScreen from './NavComponents/Login/screens/ConfirmEmailScreen';
import NewPasswordScreen from './NavComponents/Login/screens/NewPasswordScreen';
import ForgotPasswordScreen from './NavComponents/Login/screens/ForgotPasswordScreen';
import {RootStackParamListLogin} from './NavComponents/Login/LoginTypes';

type Props = {};

const StackLogin = createNativeStackNavigator<RootStackParamListLogin>();

const RootNavigator = (props: Props) => {
  return (
    <NavigationContainer>
      <StackLogin.Navigator>
        <StackLogin.Screen name="SignIn" component={SignInScreen} />
        <StackLogin.Screen name="SignUp" component={SignUpScreen} />
        <StackLogin.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
        <StackLogin.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
        />
        <StackLogin.Screen name="NewPassword" component={NewPasswordScreen} />
      </StackLogin.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});

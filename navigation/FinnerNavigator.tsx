import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {GlobalStyles} from '../constants/styles';
import {RootStackParamList} from '../types';
// import AccountsItem from '../components/Output/AccountsItem';

import MenuDrawer from './NavComponents/Drawer/MenuDrawer';

type Props = {
  // isAuthenticated: boolean | undefined;
  // colorScheme: ColorSchemeName;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const FinnerNavigator = ({}: Props) => {
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
        </Stack.Navigator>
      </NavigationContainer>
      {/* ) : (
        <RootNavigator />
      )} */}
    </>
  );
};

export default FinnerNavigator;

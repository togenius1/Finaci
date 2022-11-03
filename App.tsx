import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Amplify, Auth, Hub} from 'aws-amplify';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {setPRNG} from 'tweetnacl';

import OverviewScreen from './screens/OverviewScreen';
import AddExpensesScreen from './screens/AddExpensesScreen';
import AddDetailsScreen from './screens/AddDetailsScreen';
// import CategoryScreen from './screens/popup/Category';
import NoteScreen from './components/UI/Menu/Note';
import StatsScreen from './screens/StatsScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import {GlobalStyles} from './constants/styles';
import {RootStackParamList} from './types';
import AccountsScreen from './screens/AccountsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import DrawerContent from './screens/drawer/DrawerContent';
import ReportsScreen from './screens/ReportsScreen';
import AccountsItem from './screens/AccountsItem';

import SignInScreen from './components/Login/screens/SignInScreen/SignInScreen';
import SignUpScreen from './components/Login/screens/SignUpScreen/SignUpScreen';
import ConfirmEmailScreen from './components/Login/screens/ConfirmEmailScreen/ConfirmEmailScreen';
import NewPasswordScreen from './components/Login/screens/NewPasswordScreen/NewPasswordScreen';
import ForgotPasswordScreen from './components/Login/screens/ForgotPasswordScreen/ForgotPasswordScreen';
import {RootStackParamListLogin} from './components/Login/LoginTypes';
import awsconfig from './src/aws-exports';
import {PRNG} from './util/crypto';

Amplify.configure(awsconfig);

setPRNG(PRNG);

const StackLogin = createNativeStackNavigator<RootStackParamListLogin>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

function MenuDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={({}) => ({
        headerTintColor: 'black',
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: 'lightgrey',
          width: 240,
        },
      })}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Overview"
        component={OverviewScreen}
        options={({navigation}) => ({
          // title: 'Overview',
        })}
      />
      <Drawer.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={({navigation}) => ({
          title: 'Expenses',
        })}
      />
      <Drawer.Screen
        name="Stats"
        component={StatsScreen}
        options={({navigation}) => ({
          title: 'Stats',
        })}
      />
      <Drawer.Screen
        name="Accounts"
        component={AccountsScreen}
        options={({navigation}) => ({
          title: 'Budgets',
        })}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={({navigation}) => ({
          title: 'Reports',
        })}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={({navigation}) => ({
          title: 'Settings',
        })}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={({navigation}) => ({
          title: 'Profile',
        })}
      />
    </Drawer.Navigator>
  );
}

const App = () => {
  const [user, setUser] = useState(undefined);
  // const dispatch = useAppDispatch();
  // // const dataLoaded = useAppSelector(store => store);

  // useEffect(() => {
  //   dispatch(fetchExpensesData());
  // }, []);

  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      setUser(authUser);
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const listener = data => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut') {
        checkUser();
      }
    };
    Hub.listen('auth', listener);
    return () => Hub.remove('auth', listener);
  }, []);

  if (user === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        {user ? (
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
            {/* <Stack.Screen name="Category" component={CategoryScreen} /> */}
            {/* <Stack.Screen name="Note" component={NoteScreen} /> */}
            <Stack.Screen name="AccountsItem" component={AccountsItem} />
          </Stack.Navigator>
        ) : (
          <StackLogin.Navigator>
            <StackLogin.Screen name="SignIn" component={SignInScreen} />
            <StackLogin.Screen name="SignUp" component={SignUpScreen} />
            <StackLogin.Screen
              name="ConfirmEmail"
              component={ConfirmEmailScreen}
            />
            <StackLogin.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <StackLogin.Screen
              name="NewPassword"
              component={NewPasswordScreen}
            />
          </StackLogin.Navigator>
        )}
      </NavigationContainer>
    </>
  );
};

export default App;

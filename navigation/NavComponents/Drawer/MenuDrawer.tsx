import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import OverviewScreen from '../../../screens/OverviewScreen';
import StatsScreen from '../../../screens/StatsScreen';
import TransactionsScreen from '../../../screens/TransactionsScreen';
import AccountsScreen from '../../../screens/AccountsScreen';
import SettingsScreen from '../../../screens/SettingsScreen';
import DrawerContent from '../../../components/drawer/DrawerContent';
import ReportsScreen from '../../../screens/ReportsScreen';
import BackupScreen from '../../../screens/BackupScreen';
import RecommendScreen from '../../../screens/RecommendScreen';
import {RootStackParamList} from '../../../types';
import PaywallScreen from '../../../screens/PaywallScreen';

const Drawer = createDrawerNavigator<RootStackParamList>();

const MenuDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={() => ({
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
        options={() => ({
          // title: 'Overview',
          // headerStyle: {height: 20},
        })}
      />
      <Drawer.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={() => ({
          title: 'Expenses',
        })}
      />
      <Drawer.Screen
        name="Stats"
        component={StatsScreen}
        options={() => ({
          title: 'Stats',
        })}
      />
      <Drawer.Screen
        name="Accounts"
        component={AccountsScreen}
        options={() => ({
          title: 'Accounts',
        })}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={() => ({
          title: 'Reports',
        })}
      />
      <Drawer.Screen
        name="Backup"
        component={BackupScreen}
        options={() => ({
          title: 'Backup',
        })}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={() => ({
          title: 'Settings',
        })}
      />
      <Drawer.Screen
        name="Paywall"
        component={PaywallScreen}
        options={() => ({
          title: 'Paywall',
        })}
      />
      {/* <Drawer.Screen
        name="Recommend"
        component={RecommendScreen}
        options={() => ({
          title: 'Recommend Program',
        })}
      /> */}
    </Drawer.Navigator>
  );
};

export default MenuDrawer;

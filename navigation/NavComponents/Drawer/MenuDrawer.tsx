import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import StatsScreen from '../../../screens/StatsScreen';
import AccountsScreen from '../../../screens/AccountsScreen';
import SettingsScreen from '../../../screens/SettingsScreen';
import DrawerContent from '../../../components/drawer/DrawerContent';
import ReportsScreen from '../../../screens/ReportsScreen';
import BackupScreen from '../../../screens/BackupScreen';
import {RootStackParamList} from '../../../types';
import UserScreen from '../../../screens/UserScreen';
import TransactionStack from '../../TransactionStack';
import OverviewStack from '../../OverviewStack';

const Drawer = createDrawerNavigator<RootStackParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      useLegacyImplementation={false}
      screenOptions={() => ({
        headerTintColor: 'black',
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: 'lightgrey',
          width: 240,
        },

        headerShown: false,
      })}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="OverviewStack"
        component={OverviewStack}
        options={() => ({
          // title: 'Overview',
          // headerStyle: {height: 20},
        })}
      />

      <Drawer.Screen
        name="Transactions"
        component={TransactionStack}
        options={() => ({
          title: 'Transactions',
        })}
      />
      <Drawer.Screen
        name="Stats"
        component={StatsScreen}
        options={() => ({
          title: 'Stats',
          headerShown: true,
        })}
      />
      <Drawer.Screen
        name="Accounts"
        component={AccountsScreen}
        options={() => ({
          title: 'Accounts',
          headerShown: true,
        })}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={() => ({
          title: 'Reports',
          headerShown: true,
        })}
      />
      <Drawer.Screen
        name="Backup"
        component={BackupScreen}
        options={() => ({
          title: 'Backup',
          headerShown: true,
        })}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={() => ({
          title: 'Settings',
          headerShown: true,
        })}
      />

      <Drawer.Screen
        name="User"
        component={UserScreen}
        options={() => ({
          title: 'User',
          headerShown: true,
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

export default DrawerNavigator;

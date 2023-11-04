import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {isTablet} from 'react-native-device-info';

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
import {Dimensions, Platform, Pressable, StyleSheet, View} from 'react-native';
import {DrawerActions, useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const Drawer = createDrawerNavigator<RootStackParamList>();

const DrawerNavigator = ({}) => {
  const navigation = useNavigation<any>();

  return (
    <Drawer.Navigator
      useLegacyImplementation={false}
      screenOptions={() => ({
        headerTintColor: 'black',
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: 'lightgrey',
          width: width / 2,
        },
        headerShown: false,

        headerLeft: () => (
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <View
              style={{
                justifyContent: 'flex-start',
                marginLeft: isTablet() ? 20 : Platform.OS === 'ios' ? 10 : 10,
                width: isTablet()
                  ? width * 0.007
                  : Platform.OS === 'ios'
                  ? width * 0.035
                  : width * 0.035,
                // marginTop: height * 0.025,
                // backgroundColor: '#fed8d8',
              }}>
              <Ionicons
                name="menu-outline"
                size={
                  isTablet()
                    ? width * 0.045
                    : Platform.OS === 'ios'
                    ? width * 0.06
                    : width * 0.06
                }
                color="#000000"
                style={{marginBottom: 1}}
                // onPress={() => navigation.toggleDrawer()}
              />
            </View>
          </Pressable>
        ),
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

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
});

import {Dimensions, Platform, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RootStackParamList} from '../types';
import AddExpensesScreen from '../screens/AddExpensesScreen';
import AddDetailsScreen from '../screens/AddDetailsScreen';
import OverviewScreen from '../screens/OverviewScreen';

type Props = {};
const {width, height} = Dimensions.get('window');

const Stack = createNativeStackNavigator<RootStackParamList>();

const OverviewStack = ({}: Props) => {
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerLeft: () => (
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => navigation.openDrawer()}>
            <View style={styles.headerLeft}>
              <Ionicons
                name="menu-outline"
                size={Platform.OS === 'ios' ? width * 0.07 : width * 0.08}
                color="grey"
                style={{marginBottom: 1}}
                // onPress={() => navigation.toggleDrawer()}
              />
            </View>
          </Pressable>
        ),
      })}>
      <Stack.Screen
        name="Overview"
        component={OverviewScreen}
        options={() => ({
          title: 'Overview',
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="AddExpenses"
        component={AddExpensesScreen}
        options={{
          title: '',
          headerShown: true,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="AddDetails"
        component={AddDetailsScreen}
        options={{
          title: '',
          headerShown: true,
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
};

export default OverviewStack;

const styles = StyleSheet.create({
  headerLeft: {
    justifyContent: 'flex-start',
    marginRight: width * 0.6,
    width: width * 0.07,
    marginTop: height * 0.025,
    // backgroundColor: '#fed8d8',
  },
  pressed: {
    opacity: 0.65,
  },
});

// import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TransactionSummary from '../Output/TransactionSummary';

const TransactScreenComponent = ({
  tabs,
  setInsideTabIndex,
  middleTabIndex,
}: Props) => {
  const TopTab = createMaterialTopTabNavigator();

  return (
    <TopTab.Navigator
      screenListeners={{
        state: e => {
          // Do something with the state
          // console.log('Page Index: ', e.data?.state?.index);
          setInsideTabIndex(e.data?.state?.index);
        },
      }}
      initialRouteName={tabs[middleTabIndex]?.name}
      // onTabPress={({index}) => onTabChange(index)}
      screenOptions={() => ({
        tabBarIndicatorStyle: {backgroundColor: 'transparent'},
        tabBarShowLabel: false,
        // tabBarContentContainerStyle: {height: 0},
      })}>
      {tabs?.map((tab, index) => (
        <TopTab.Screen key={index} name={tab?.name}>
          {() => (
            <TransactionSummary
              // insideTabIndex={insideTabIndex}
              {...tab.props}
            />
          )}
        </TopTab.Screen>
      ))}
    </TopTab.Navigator>
  );
};

export default TransactScreenComponent;

// const styles = StyleSheet.create({});

//============================ TYPE ====================================
type Props = {
  tabs: any[];
  setInsideTabIndex: (index: number) => void;
  // currentTabIndex: number;
  // year: number;
  middleTabIndex: number;
  // insideTabIndex: number;
};

// interface ScreenType {
//   tabs: any[];
//   setInsideTabIndex: (index: number) => void;
//   // currentTabIndex: number;
//   // year: number;
//   middleTabIndex: number;
//   // insideTabIndex: number;
// }

import {StyleSheet} from 'react-native';
import React from 'react';
import TransactScreenComponent from './TransactScreenComponent';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

type Props = {
  tabs: any[];
  setCurrentTabIndex: (index: number) => void;
  // setInsideTabIndex: (index: number) => void;
  currentTabIndex: number;
  year: number;
  month: number;
  middleTabIndex: number;
};

const TopTabs = ({
  tabs,
  setCurrentTabIndex,
  // setInsideTabIndex,
  currentTabIndex,
  middleTabIndex, // insideTabIndex,
}: Props) => {
  const TopTab = createMaterialTopTabNavigator();

  return (
    <TopTab.Navigator
      initialRouteName={'Monthly'}
      screenListeners={{
        state: e => {
          // Do something with the state
          // console.log('Page Index: ', e.data?.state?.index);
          setCurrentTabIndex(e.data?.state?.index);
        },
      }}
      screenOptions={() => ({
        tabBarIndicatorStyle: {
          backgroundColor: 'red',
          // height: 1,
        },
        tabBarContentContainerStyle: {
          width: 'auto',
          alignItems: 'center',
          justifyContent: 'space-around',
        },
        tabBarLabelStyle: {
          width: 'auto',
          marginHorizontal: 0,
          fontSize: 14,
          fontWeight: '500',
          textTransform: 'none',
        },
        tabBarScrollEnabled: false,
      })}>
      {/* <TopTab.Screen name="MONTHLY" component={TransactScreenComponent} /> */}
      <TopTab.Screen name={'Monthly'}>
        {() =>
          currentTabIndex === 0 && (
            <TransactScreenComponent
              tabs={tabs}
              // setInsideTabIndex={setInsideTabIndex}
              middleTabIndex={middleTabIndex}
              // insideTabIndex={insideTabIndex}
            />
          )
        }
      </TopTab.Screen>
      <TopTab.Screen name={'Weekly'}>
        {() =>
          currentTabIndex === 1 && (
            <TransactScreenComponent
              tabs={tabs}
              // setInsideTabIndex={setInsideTabIndex}
              middleTabIndex={middleTabIndex}
              // insideTabIndex={insideTabIndex}
            />
          )
        }
      </TopTab.Screen>
      <TopTab.Screen name={'Daily'}>
        {() =>
          currentTabIndex === 2 && (
            <TransactScreenComponent
              tabs={tabs}
              // setInsideTabIndex={setInsideTabIndex}
              middleTabIndex={middleTabIndex}
              // insideTabIndex={insideTabIndex}
            />
          )
        }
      </TopTab.Screen>
      <TopTab.Screen name={'Custom'}>
        {() =>
          currentTabIndex === 3 && (
            <TransactScreenComponent
              tabs={tabs}
              // setInsideTabIndex={setInsideTabIndex}
              middleTabIndex={middleTabIndex}
              // insideTabIndex={insideTabIndex}
            />
          )
        }
      </TopTab.Screen>
      <TopTab.Screen name={'Export'}>
        {() =>
          currentTabIndex === 4 && (
            <TransactScreenComponent
              tabs={tabs}
              // setInsideTabIndex={setInsideTabIndex}
              middleTabIndex={middleTabIndex}
              // insideTabIndex={insideTabIndex}
            />
          )
        }
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};

export default TopTabs;

const styles = StyleSheet.create({});

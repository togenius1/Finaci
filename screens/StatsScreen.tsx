import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import LineChart from '../components/Graph/LineChart';
import MonthYearList from '../components/Menu/MonthYearList';
import {StatsNavigationProp} from '../types';
import {useAppSelector} from '../hooks';

// const {width, height} = Dimensions.get('window');

const TopTab = createMaterialTopTabNavigator();

function TopTabs({
  indicatorIndex,
  RenderExpenseTab,
  RenderIncomeTab,
  setIndicatorIndex,
}: ScreenTabType) {
  return (
    <TopTab.Navigator
      initialRouteName={'Monthly'}
      screenListeners={{
        state: e => {
          // Do something with the state
          // console.log('Page Index: ', e.data?.state?.index);
          setIndicatorIndex(e.data?.state?.index);
        },
      }}
      screenOptions={() => ({
        // tabBarIndicatorStyle: {backgroundColor: 'red'},
        // tabBarShowLabel: false,
        tabBarContentContainerStyle: {
          width: 'auto',
          alignItems: 'center',
          justifyContent: 'space-around',
        },
        tabBarLabelStyle: {
          width: 'auto',
          marginHorizontal: 0,
          fontSize: 12,
          fontWeight: '600',
        },
        // tabBarItemStyle: {
        //   backgroundColor: 'red',
        // },
        tabBarScrollEnabled: false,
      })}>
      {/* <TopTab.Screen name="MONTHLY" component={TransactScreenComponent} /> */}
      <TopTab.Screen name={'Expense'}>
        {() => indicatorIndex === 0 && <RenderExpenseTab />}
      </TopTab.Screen>
      <TopTab.Screen name={'Income'}>
        {() => indicatorIndex === 1 && <RenderIncomeTab />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
}

const HeaderRightComponent = ({
  // indicatorIndex,
  year,
  // month,
  setIsModalVisible,
}: HeaderRight) => {
  // const monthName = moment.monthsShort(+month - 1);

  return (
    <View>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => setIsModalVisible(true)}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#ffd3d3',
            marginRight: 25,
          }}>
          <Text style={{fontSize: 16, color: '#2a8aff'}}>
            {/* {indicatorIndex !== 0 ? '' : monthName} {year} */}
            {year}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const StatsScreen = ({navigation}: Props) => {
  // const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);
  // const navigation = useNavigation();

  // const expenseData = dataLoaded?.expenses?.expenses;
  const monthlyTransactsData = dataLoaded?.monthlyTransacts?.monthlyTransacts;

  // const [fromDate, setFromDate] = useState<string | null>();
  // const [toDate, setToDate] = useState<string | null>(initToDate);
  const [indicatorIndex, setIndicatorIndex] = useState<number | undefined>(0);
  const [year, setYear] = useState<number>(moment().year());
  const [month, setMonth] = useState<number>(moment().month() + 1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // const [duration, setDuration] = useState(moment().year());

  useEffect(() => {
    // setIndicatorIndex(0);
    // onMonthYearSelectedHandler(moment().month());
    onMonthYearSelectedHandler(moment().year());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => (
        <HeaderRightComponent
          year={year}
          // month={month}
          // indicatorIndex={Number(indicatorIndex)}
          setIsModalVisible={setIsModalVisible}
        />
      ),
    });
  }, [year, indicatorIndex]);

  // Filter Expense Data
  const filteredDataExpense = monthlyTransactsData?.filter(
    d => +moment(d?.date).year() === year,
  );

  // data for expense line chart
  const filteredDataIncome = monthlyTransactsData?.filter(
    d => +moment(d?.date).year() === year,
  );

  // Set Month Year
  function onMonthYearSelectedHandler(time) {
    let fromdate;
    let todate;
    let month;

    const mm = +moment().month(time).format('MM');
    // const daysInMonth = moment(moment().format(`${year}-${mm}`)).daysInMonth();

    // if (indicatorIndex === 1 || indicatorIndex === 2) {
    fromdate = moment(`${year}-01-01`).format('YYYY-MM-DD');
    todate = moment(`${year}-12-31`).format('YYYY-MM-DD');
    month = moment().month() + 1;
    setYear(time);

    setIsModalVisible(false);
  }

  const RenderExpenseTab = () => {
    return (
      <View style={{marginTop: 25}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Expense</Text>
        </View>

        <LineChart
          type="expense"
          lineChartData={filteredDataExpense}
          lineChartColor="red"
          circleColor="red"
        />
      </View>
    );
  };

  const RenderIncomeTab = () => {
    return (
      <View style={{marginTop: 25}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Income</Text>
        </View>
        <LineChart
          type="income"
          lineChartData={filteredDataIncome}
          lineChartColor="#006057"
          circleColor="#006057"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopTabs
        indicatorIndex={Number(indicatorIndex)}
        RenderExpenseTab={RenderExpenseTab}
        RenderIncomeTab={RenderIncomeTab}
        setIndicatorIndex={setIndicatorIndex}
      />

      <MonthYearList
        // monthlyPressed={indicatorIndex !== 0 ? true : false}
        monthlyPressed={true}
        onMYSelectedHandler={onMonthYearSelectedHandler}
        year={+year}
        setYear={setYear}
        month={month}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default StatsScreen;

//================================================================
// -------------------------  TYPE ------------------------------
type Props = {
  navigation: StatsNavigationProp;
};

type HeaderRight = {
  // indicatorIndex: number;
  year: number;
  // month: number;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

// Top tap interface
interface ScreenTabType {
  // tabs: any[];
  RenderExpenseTab: () => React.JSX.Element;
  RenderIncomeTab: () => React.JSX.Element;
  setIndicatorIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  indicatorIndex: number;
}

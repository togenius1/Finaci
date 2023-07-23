import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import {sumTotalFunc} from '../../util/math';
import {currencyFormatter} from '../../util/currencyFormatter';
import {getDaysInWeek} from '../../util/date';
import Export from '../Menu/Export';
import {TransactionSummaryNavigationProp} from '../../types';
import {useAppSelector} from '../../hooks';
import TransactContext from '../../store-context/transact-context';

const {width, height} = Dimensions.get('window');

// Monthly renderItem
function MonthlyRenderItem({item}) {
  const monthLabel = moment.monthsShort(Number(item?.month) - 1);
  const expenseAmount = currencyFormatter(item?.expense_monthly, {});
  const incomeAmount = currencyFormatter(item?.income_monthly, {});

  if (+expenseAmount === 0 && +incomeAmount === 0) {
    return;
  }

  return (
    <View style={styles.list}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: width / 4,
          marginRight: 10,
          // backgroundColor: '#e1f3cd',
        }}>
        <Text style={{color: 'blue'}}>{incomeAmount}</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: width / 4,
          marginRight: 20,
          // backgroundColor: '#f5bebe',
        }}>
        <Text style={{color: 'red'}}>{expenseAmount}</Text>
      </View>
      <View style={[styles.dateContainer, styles.monthLabel]}>
        <Text style={{fontSize: 12, color: 'white'}}>{monthLabel}</Text>
      </View>
    </View>
  );
}

// Weekly renderItem
function WeeklyRenderItem({item}) {
  const expenseAmount = currencyFormatter(+item.expense_weekly, {});
  const incomeAmount = currencyFormatter(+item.income_weekly, {});
  const weekNum = item?.week;

  if (+expenseAmount === 0 && +incomeAmount === 0) {
    return;
  }

  const date = new Date(item.date);
  let month = moment(item.date).month() + 1;
  const year = moment(item.date).year(); // Fixed

  const daysInMonth = moment(date, 'YYYY-MM-DD').daysInMonth();
  const weeks = getDaysInWeek(String(year), String(month), daysInMonth);

  let startDateOfWeek;
  let endDateOfWeek;
  if (weekNum === 1) {
    startDateOfWeek = moment(weeks[0].w1[0]).date();
    endDateOfWeek = moment(weeks[0].w1[weeks[0].w1.length - 1]).date();
  }
  if (weekNum === 2) {
    startDateOfWeek = moment(weeks[0].w2[0]).date();
    endDateOfWeek = moment(weeks[0].w2[weeks[0].w2.length - 1]).date();
  }
  if (weekNum === 3) {
    startDateOfWeek = moment(weeks[0].w3[0]).date();
    endDateOfWeek = moment(weeks[0].w3[weeks[0].w3.length - 1]).date();
  }
  if (weekNum === 4) {
    startDateOfWeek = moment(weeks[0].w4[0]).date();
    endDateOfWeek = moment(weeks[0].w4[weeks[0].w4.length - 1]).date();
  }
  if (weekNum === 5) {
    startDateOfWeek =
      weeks[0].w5[0] !== undefined ? moment(weeks[0].w5[0]).date() : '';
    endDateOfWeek =
      weeks[0].w5[0] !== undefined
        ? moment(weeks[0].w5[weeks[0].w5.length - 1]).date()
        : '';
  }

  if (Number(startDateOfWeek) < 10) {
    startDateOfWeek = `0${startDateOfWeek}`;
  }
  if (Number(endDateOfWeek) < 10) {
    endDateOfWeek = `0${endDateOfWeek}`;
  }

  return (
    <View style={styles.list}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: width / 4,
          marginRight: 10,
          // backgroundColor: '#e1f3cd',
        }}>
        <Text style={{color: 'blue'}}>{incomeAmount}</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: width / 4,
          marginRight: 20,
          // backgroundColor: '#f5bebe',
        }}>
        <Text style={{color: 'red'}}>{expenseAmount}</Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
        }}>
        <View style={[styles.dateContainer, styles.weekLabel]}>
          <Text style={{fontSize: 12, color: 'white'}}>W{weekNum}</Text>
        </View>
        <Text
          style={{
            fontSize: 10,
            fontStyle: 'italic',
            color: 'grey',
            marginTop: 5,
          }}>{`${startDateOfWeek} - ${endDateOfWeek}`}</Text>
      </View>
    </View>
  );
}

// Daily Items
const DailyItem = ({
  incomeAmount,
  expenseAmount,
  day,
  dayLabel,
  monthLabel,
  year,
  // time,
  navigation,
}: DailyItemType) => {
  if (day < 10) {
    day = `0${day}`;
  }

  const month = moment().month(monthLabel).format('MM');
  const date = `${year}-${month}-${day}`;

  return (
    <View style={styles.list}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() =>
          navigation.navigate('IncomesDetails', {
            date: date,
            // time: time,
          })
        }>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: width / 4,
            marginRight: 10,
            // backgroundColor: '#e1f3cd',
          }}>
          <Text style={{fontSize: 14, color: 'blue'}}>{incomeAmount}</Text>
          {/* <Text style={{fontSize: 10, color: 'grey'}}>{incomeCategory}</Text> */}
        </View>
      </Pressable>

      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() =>
          navigation.navigate('ExpensesDetails', {
            date: date,
            // time: time,
          })
        }>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: width / 4,
            marginRight: 20,
            // backgroundColor: '#f5bebe',
          }}>
          <Text style={{fontSize: 14, color: 'red'}}>{expenseAmount}</Text>
          {/* <Text style={{fontSize: 10, color: 'grey'}}>{expenseCategory}</Text> */}
        </View>
      </Pressable>

      <View style={styles.dateContainer}>
        <View style={styles.dateLabel}>
          <Text style={{fontSize: 12, color: 'white'}}>{dayLabel}</Text>
        </View>
        <Text style={{fontSize: 16, fontWeight: '800'}}>{day} </Text>
        <Text style={{fontSize: 12, color: 'grey'}}>{monthLabel} </Text>
        <Text style={{fontSize: 12, color: 'grey'}}>{year}</Text>
      </View>
    </View>
  );
};

// Main function
const TransactionSummary = ({}: Props) => {
  // Parameters
  let _renderItem: any = '';
  let _renderData: any = [];

  const navigation = useNavigation();

  const dataLoaded = useAppSelector(store => store);

  // Transaction states
  const transactCtx = useContext(TransactContext);
  const fromDate = transactCtx?.fromDate;
  const toDate = transactCtx?.toDate;
  const monthlyPressed = transactCtx?.monthlyPressed;
  const weeklyPressed = transactCtx?.weeklyPressed;
  const dailyPressed = transactCtx?.dailyPressed;
  const customPressed = transactCtx?.customPressed;
  const exportPressed = transactCtx?.exportPressed;
  // Data from local storage
  const MonthlyTransactsData = dataLoaded?.monthlyTransacts?.monthlyTransacts;
  const WeeklyTransactsData = dataLoaded?.weeklyTransacts?.weeklyTransacts;
  const DailyTransactionData = dataLoaded?.dailyTransacts?.dailyTransacts;

  const date = moment(fromDate).format('YYYY-MM-DD');

  // Monthly Transaction
  // const filteredMonthlyData = monthlyTransaction(fromDate, toDate, year);
  const filteredMonthlyData = MonthlyTransactsData?.filter(
    transact => moment(transact?.date).year() === moment(fromDate).year(),
    // &&
    // transact?.month === moment(date).month() + 1,
  );

  //  Weekly Transaction
  // const weeklyData = weeklyTransaction(fromDate, toDate, date);
  const weeklyData = WeeklyTransactsData?.filter(
    transact =>
      // console.log(moment(transact?.date).month() + 1),
      moment(transact?.date).month() === moment(date).month() &&
      moment(transact?.date).year() === moment(date).year(),
  );

  // Combine data and sum by date
  // const dailyData = dailyTransaction(String(fromDate), String(toDate), date);
  // console.log('fromDate', fromDate);
  // console.log('toDate', toDate);
  const dailyData = DailyTransactionData?.filter(
    transact =>
      moment(transact?.date).format('YYYY-MM-DD') >=
        moment(fromDate).format('YYYY-MM-DD') &&
      moment(transact?.date).format('YYYY-MM-DD') <=
        moment(toDate).format('YYYY-MM-DD'),
  );

  // console.log('dailyData:', dailyData);
  // console.log('fromDate:', fromDate);

  // on pressed
  if (monthlyPressed) {
    _renderItem = MonthlyRenderItem;
    _renderData = filteredMonthlyData;
  }
  if (weeklyPressed) {
    _renderItem = WeeklyRenderItem;
    _renderData = weeklyData;
  }
  if (dailyPressed) {
    _renderItem = DailyRenderItem;
    _renderData = dailyData;
  }
  if (customPressed) {
    _renderItem = DailyRenderItem;
    _renderData = dailyData;
  }

  const sortedItems = _renderData?.sort((a, b) => {
    const dateA = new Date(a.date).valueOf();
    const dateB = new Date(b.date).valueOf();
    if (dateA < dateB) {
      return 1; // return 1 here for AESC order
    }
    return -1; // return -1 here for DESC Order
  });

  // daily renderItem
  function DailyRenderItem({item}) {
    const expenseAmount = currencyFormatter(item.expense_daily, {});
    const incomeAmount = currencyFormatter(item.income_daily, {});

    if (+expenseAmount === 0 && +incomeAmount === 0) {
      return;
    }

    const date = item.date;
    let day = moment(date).date();
    if (day < 10) {
      day = +`0${day}`;
    }
    // const time = moment(date).format('hh:mm A');

    const dayLabel = moment(date).format('ddd');
    const monthLabel = moment(date).format('MMM');
    const year = moment(date).year();

    return (
      <DailyItem
        incomeAmount={incomeAmount}
        expenseAmount={expenseAmount}
        day={day}
        dayLabel={dayLabel}
        monthLabel={monthLabel}
        year={year}
        // time={time}
        navigation={navigation}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.tinyLogo}
        source={require('../../assets/images/Finner.png')}
        resizeMode="center"
      />

      {!exportPressed && (
        <FlatList
          keyExtractor={item => item + uuidv4()}
          data={sortedItems}
          renderItem={_renderItem}
          bounces={false}
        />
      )}

      {exportPressed && <Export />}
    </View>
  );
};

export default TransactionSummary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: width,
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginLeft: 0,
    marginRight: 0,
    marginVertical: 5,
    backgroundColor: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    width: 110,
    marginRight: 2,
    marginTop: 5,
    // backgroundColor: '#ffeeee',
  },
  dateLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6f6f6f',
    width: 30,
    height: 20,
    marginRight: 5,
    borderWidth: 0.5,
    borderColor: '#black',
  },
  monthLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    width: 35,
    height: 20,
    marginRight: 15,
  },
  weekLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    width: 35,
    height: 20,
    marginRight: 15,
  },
  tinyLogo: {
    width: width / 4,
    height: height / 10,
    marginTop: height / 5,
    marginLeft: width / 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    opacity: 0.7,

    position: 'absolute',
  },
  pressed: {
    opacity: 0.65,
  },
});

// ============================= TYPE and INTERFACE ====================================
type Props = {};

// interface HeaderSummaryType {
//   total: number;
//   totalIncome: number;
//   totalExpenses: number;
// }

export interface DailyItemType {
  incomeAmount: number;
  expenseAmount: number;
  day: number;
  dayLabel: string;
  monthLabel: string;
  year: number;
  time: string;
  navigation: TransactionSummaryNavigationProp;
}

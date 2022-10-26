import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  sumByCustomDate,
  sumByDate,
  sumByMonth,
  sumByWeek,
  sumTotalFunc,
} from '../../util/math';

import {currencyFormatter} from '../../util/currencyFormatter';
import {getDaysInWeek} from '../../util/date';
import Export from '../UI/Menu/Export';
import {useAppSelector} from '../../hooks';
import {useNavigation} from '@react-navigation/native';

type Props = {};

const {width, height} = Dimensions.get('window');

function HeaderSummary({total, totalIncome, totalExpenses}) {
  return (
    <View style={styles.assetsContainer}>
      <View style={styles.assetBox}>
        <Text style={{fontSize: 14}}>Income</Text>
        <Text style={{color: 'blue', fontSize: 16, fontWeight: 'bold'}}>
          {currencyFormatter(+totalIncome, {
            symbol: '$',
            significantDigits: 2,
            thousandsSeparator: ',',
            decimalSeparator: '.',
          })}
        </Text>
      </View>
      <View style={styles.assetBox}>
        <Text style={{fontSize: 14}}>Expenses</Text>
        <Text style={{color: 'red', fontSize: 16, fontWeight: 'bold'}}>
          {currencyFormatter(+totalExpenses, {
            symbol: '$',
            significantDigits: 2,
            thousandsSeparator: ',',
            decimalSeparator: '.',
          })}
        </Text>
      </View>
      <View style={styles.assetBox}>
        <Text style={{fontSize: 14}}>Total</Text>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {currencyFormatter(+total, {
            symbol: '$',
            significantDigits: 2,
            thousandsSeparator: ',',
            decimalSeparator: '.',
          })}
        </Text>
      </View>
    </View>
  );
}

// Monthly renderItem
function MonthlyRenderItem({item}) {
  const monthLabel = moment.monthsShort(item.Products[0].month - 1);
  const expenseAmount = currencyFormatter(item.Products[0]?.amount, {});
  const incomeAmount = currencyFormatter(item.Products[1]?.amount, {});
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
  const expenseAmount = currencyFormatter(item.Products[0]?.amount, {});
  const incomeAmount = currencyFormatter(item.Products[1]?.amount, {});
  const weekNum = item.Products[0].week;

  const year = moment(item.Date).year();
  const month = moment(item.Date).month() + 1;
  const daysInMonth = moment(item.Date).daysInMonth();
  const weeks = getDaysInWeek(year, month, daysInMonth);

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

  if (startDateOfWeek < 10) {
    startDateOfWeek = `0${startDateOfWeek}`;
  }
  if (endDateOfWeek < 10) {
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
  navigation,
}) => {
  return (
    <View style={styles.list}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => navigation.navigate('AddDetails')}>
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
        onPress={() => navigation.navigate('AddDetails')}>
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

const TransactionSummary = ({
  expenseData,
  incomeData,
  monthlyPressed,
  weeklyPressed,
  dailyPressed,
  customPressed,
  fromDate,
  toDate,
  exportPressed,
}: Props) => {
  // Parameters
  let _renderItem = '';
  let _renderData = [];
  const date = moment(fromDate, 'YYYY-MM-DD');

  const navigation = useNavigation();

  const selectedExpenseRedux = useAppSelector(store => store);
  const selectedExpense = selectedExpenseRedux.transfers;

  // FILTERED DATA (From date ----> To date)
  const selectedDurationExpenseData = expenseData?.filter(
    expense =>
      new Date(expense.date) >= new Date(fromDate) &&
      new Date(expense.date) <= new Date(toDate),
  );
  const selectedDurationIncomeData = incomeData?.filter(
    income =>
      new Date(income.date) >= new Date(fromDate) &&
      new Date(income.date) <= new Date(toDate),
  );

  // TOTAL EXPENSE
  const totalExpenses = sumTotalFunc(selectedDurationExpenseData).toFixed(0);
  const totalIncome = sumTotalFunc(selectedDurationIncomeData).toFixed(0);
  const total = totalIncome - totalExpenses;

  // Combine data and sum by monthly
  const sumExpenseByMonth = sumByMonth(selectedDurationExpenseData, 'expense');
  const sumIncomeByMonth = sumByMonth(selectedDurationIncomeData, 'income');
  const data2 = [...sumExpenseByMonth, ...sumIncomeByMonth];
  let monthlyData = Object.values(
    data2.reduce((acc, cur) => {
      if (!acc[cur.month]) {
        acc[cur.month] = {Month: cur.month, Date: cur?.date, Products: []};
      }
      acc[cur.month].Products.push(cur);
      return acc;
    }, {}),
  );

  // Combine data and sum by weekly
  const sumExpenseByWeek = sumByWeek(
    selectedDurationExpenseData,
    'expense',
    date,
  );
  const sumIncomeByWeek = sumByWeek(selectedDurationIncomeData, 'income', date);
  const data3 = [...sumExpenseByWeek, ...sumIncomeByWeek];
  // const selectedMonth = moment(fromDate).month() + 1;
  let weeklyData = Object.values(
    data3.reduce((acc, cur) => {
      if (!acc[cur.week]) {
        acc[cur.week] = {Week: cur.week, Products: [], Date: fromDate};
      }
      acc[cur.week].Products.push(cur);
      return acc;
    }, {}),
  );

  // Combine data and sum by date
  const sumExpenseByDate = sumByDate(
    selectedDurationExpenseData,
    'expense',
    date,
  );
  const sumIncomeByDate = sumByDate(selectedDurationIncomeData, 'income', date);
  const data = [...sumExpenseByDate, ...sumIncomeByDate];
  let dailyData = Object.values(
    data.reduce((acc, cur) => {
      if (!acc[cur.day])
        acc[cur.day] = {Day: cur.day, Date: cur?.date, Products: []};
      acc[cur.day].Products.push(cur);
      return acc;
    }, {}),
  );

  // Combine data and sum by custom
  const sumExpenseByCustomDate = sumByCustomDate(
    selectedDurationExpenseData,
    'expense',
    fromDate,
    toDate,
  );
  const sumIncomeByCustomDate = sumByCustomDate(
    selectedDurationIncomeData,
    'income',
    fromDate,
    toDate,
  );
  const data4 = [...sumExpenseByCustomDate, ...sumIncomeByCustomDate];
  let customData = Object.values(
    data4.reduce((acc, cur) => {
      if (!acc[cur?.day])
        acc[cur?.day] = {Day: cur?.day, Date: cur?.date, Products: []};
      acc[cur?.day].Products.push(cur);
      return acc;
    }, {}),
  );

  // on pressed
  if (monthlyPressed) {
    _renderItem = MonthlyRenderItem;
    _renderData = monthlyData;
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
    _renderData = customData;
  }

  // if (!monthlyPressed) {
  //sort Data
  _renderData?.sort((a: any, b: any) => {
    const dateA = new Date(a.Date);
    const dateB = new Date(b.Date);
    if (dateA > dateB) {
      return -1; // return -1 here for DESC order
    }
    return 1; // return 1 here for DESC Order
  });
  // }

  // daily renderItem
  function DailyRenderItem({item}) {
    const expenseAmount = currencyFormatter(item.Products[0]?.amount, {});
    const incomeAmount = currencyFormatter(item.Products[1]?.amount, {});

    const date = new Date(item.Products[0]?.date);
    let day = moment(date).date();
    if (day < 10) {
      day = `0${day}`;
    }
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
        navigation={navigation}
      />
    );
  }

  // daily renderItem
  function DailyRenderItem({item}) {
    const expenseAmount = currencyFormatter(item.Products[0]?.amount, {});
    const incomeAmount = currencyFormatter(item.Products[1]?.amount, {});

    const date = new Date(item.Products[0]?.date);
    let day = moment(date).date();
    if (day < 10) {
      day = `0${day}`;
    }
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
        navigation={navigation}
      />
    );
  }

  return (
    <View style={styles.container}>
      <HeaderSummary
        total={total}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />

      {!exportPressed && (
        <FlatList
          keyExtractor={item => item + uuidv4()}
          data={_renderData}
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
    marginBottom: 50,
  },
  assetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    marginVertical: 5,
    backgroundColor: 'white',
    borderColor: '#b8b8b8',
    borderBottomWidth: 0.4,
  },
  assetBox: {
    justifyContent: 'center',
    alignItems: 'center',
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
  pressed: {
    opacity: 0.75,
  },
});

import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import {sumTotalFunc} from '../../util/math';
import {currencyFormatter} from '../../util/currencyFormatter';
import {getDaysInWeek} from '../../util/date';
import Export from '../Menu/Export';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {useNavigation} from '@react-navigation/native';
import {ExpenseType} from '../../models/expense';
import {IncomeType} from '../../models/income';
import {TransactionSummaryNavigationProp} from '../../types';
import {fetchWeeklyTransactsData} from '../../store/weeklyTransact-action';
import {fetchDailyTransactsData} from '../../store/dailyTransact-action';

type Props = {
  expenseData: ExpenseType | undefined;
  incomeData: IncomeType | undefined;
  monthlyPressed: boolean;
  weeklyPressed: boolean;
  dailyPressed: boolean;
  customPressed: boolean;
  fromDate: string | null;
  toDate: string | null;
  exportPressed: boolean;
  year: string | null;
};

interface HeaderSummaryType {
  total: number;
  totalIncome: number;
  totalExpenses: number;
}

interface DailyItemType {
  incomeAmount: number;
  expenseAmount: number;
  day: number;
  dayLabel: string;
  monthLabel: string;
  year: number;
  navigation: TransactionSummaryNavigationProp;
}

const {width} = Dimensions.get('window');

function HeaderSummary({total, totalIncome, totalExpenses}: HeaderSummaryType) {
  return (
    <View style={styles.assetsContainer}>
      <View style={styles.assetBox}>
        <Text style={{fontSize: 14}}>Income</Text>
        <Text style={{color: 'blue', fontSize: 16, fontWeight: 'bold'}}>
          {currencyFormatter(+totalIncome, {})}
        </Text>
      </View>
      <View style={styles.assetBox}>
        <Text style={{fontSize: 14}}>Expenses</Text>
        <Text style={{color: 'red', fontSize: 16, fontWeight: 'bold'}}>
          {currencyFormatter(+totalExpenses, {})}
        </Text>
      </View>
      <View style={styles.assetBox}>
        <Text style={{fontSize: 14}}>Total</Text>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {currencyFormatter(+total, {})}
        </Text>
      </View>
    </View>
  );
}

// Monthly renderItem
function MonthlyRenderItem({item}) {
  const monthLabel = moment.monthsShort(Number(item?.month) - 1);
  const expenseAmount = currencyFormatter(item?.expense_monthly, {});
  const incomeAmount = currencyFormatter(item?.income_monthly, {});

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
  navigation,
}: DailyItemType) => {
  if (day < 10) {
    day = `0${day}`;
  }

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
  monthlyPressed,
  weeklyPressed,
  dailyPressed,
  customPressed,
  fromDate,
  toDate,
  exportPressed,
  year,
}: // monthlyTransactions,
// weeklyTransactions,
// dailyTransactions,
Props) => {
  // Parameters
  let _renderItem = '';
  let _renderData = [];
  const date = moment(fromDate).format('YYYY-MM-DD');

  const navigation = useNavigation();

  const dataLoaded = useAppSelector(store => store);

  // FILTERED DATA (From date ----> To date)
  const selectedDurationExpenseData = dataLoaded?.expenses?.expenses?.filter(
    expense =>
      new Date(expense.date) >= new Date(String(fromDate)) &&
      new Date(expense.date) <= new Date(String(toDate)),
  );
  const selectedDurationIncomeData = dataLoaded?.incomes?.incomes.filter(
    income =>
      new Date(income.date) >= new Date(String(fromDate)) &&
      new Date(income.date) <= new Date(String(toDate)),
  );

  // TOTAL EXPENSE
  const totalExpenses = +sumTotalFunc(selectedDurationExpenseData).toFixed(0);
  const totalIncome = +sumTotalFunc(selectedDurationIncomeData).toFixed(0);
  const total = totalIncome - totalExpenses;

  // Monthly Transaction
  // const monthlyData = monthlyTransaction(fromDate, toDate, year);
  const monthlyData = dataLoaded?.monthlyTransacts?.monthlyTransacts?.filter(
    transact => moment(transact?.date).year() === moment(date).year(),
  );

  //  Weekly Transaction
  // const weeklyData = weeklyTransaction(fromDate, toDate, date);
  const weeklyData = dataLoaded?.weeklyTransacts?.weeklyTransacts?.filter(
    transact => moment(transact?.date).month() === moment(date).month(),
  );

  // Combine data and sum by date
  // const dailyData = dailyTransaction(String(fromDate), String(toDate), date);
  const dailyData = dataLoaded?.dailyTransacts?.dailyTransacts.filter(
    transact =>
      new Date(transact?.date) >= new Date(fromDate) &&
      new Date(transact?.date) <= new Date(toDate),
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
    _renderData = dailyData;
  }

  //sort Data
  _renderData?.sort((a: any, b: any) => {
    const dateA = new Date(moment(a.date).format('YYYY-MM-DD'));
    const dateB = new Date(moment(b.date).format('YYYY-MM-DD'));
    if (dateA > dateB) {
      return -1; // return -1 here for DESC order
    }
    return 1; // return 1 here for DESC Order
  });

  // daily renderItem
  function DailyRenderItem({item}) {
    const expenseAmount = currencyFormatter(item.expense_daily, {});
    const incomeAmount = currencyFormatter(item.income_daily, {});

    if (customPressed && +expenseAmount === 0 && +incomeAmount === 0) {
      return;
    }

    const date = item.date;
    let day = moment(date).date();
    if (day < 10) {
      day = +`0${day}`;
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

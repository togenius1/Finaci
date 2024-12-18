import {FlatList, View} from 'react-native';
import React, {useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';

import {useAppSelector} from '../hooks';
import DailyItemElement from '../components/Output/DailyItemElement';
import {
  ExpensesDetailsNavigationProp,
  ExpensesDetailsRouteProp,
} from '../types';
import {currencyFormatter} from '../util/currencyFormatter';

// const {width, height} = Dimensions.get('window');

const ExpensesDetailsScreen = ({route, navigation}: Props) => {
  const dataLoaded = useAppSelector(store => store);

  const Expenses = dataLoaded?.expenses?.expenses;

  const date = route.params.date;
  // const time = route.params.time;

  useEffect(() => {
    navigation.setOptions({
      title: 'Expenses',
      // headerTitleAlign: 'left',
      // headerTitleContainerStyle: {marginLeft: 0},
    });
  }, []);

  const filteredExpenses = Expenses.filter(
    exp => moment(exp.date).format('YYYY-MM-DD') === date,
  );

  // daily renderItem
  function renderItem({item}) {
    // const expenseAmount = currencyFormatter(item.expense_daily, {});
    const expenseAmount = currencyFormatter(item.amount, {
      significantDigits: 0,
    });
    // const incomeAmount = item.amount;
    const accountId = item.accountId;
    const cateId = item.cateId;
    const itemId = item.id;
    const time = moment(item.date).format('LT');

    if (+expenseAmount === 0) {
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
      <DailyItemElement
        amount={expenseAmount}
        type={'expense'}
        day={day}
        dayLabel={dayLabel}
        monthLabel={monthLabel}
        year={year}
        time={time}
        accountId={accountId}
        cateId={cateId}
        itemId={itemId}
      />
    );
  }

  return (
    <View>
      <FlatList
        keyExtractor={item => item + uuidv4()}
        data={filteredExpenses}
        renderItem={renderItem}
        bounces={false}
      />
    </View>
  );
};

export default ExpensesDetailsScreen;

// const styles = StyleSheet.create({});

// ============================== TYPE ===================================
type Props = {
  navigation: ExpensesDetailsNavigationProp;
  route: ExpensesDetailsRouteProp;
};

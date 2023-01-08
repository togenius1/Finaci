import {FlatList, View} from 'react-native';
import React from 'react';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';

import {currencyFormatter} from '../util/currencyFormatter';
import {useAppSelector} from '../hooks';
import DailyItemElement from './screenComponents/DailyItemElement';

type Props = {};

// const {width, height} = Dimensions.get('window');

const ExpensesDetailsScreen = ({route}: Props) => {
  const dataLoaded = useAppSelector(store => store);

  const Expenses = dataLoaded?.expenses?.expenses;

  const date = route.params.date;
  const time = route.params.time;

  const filteredExpenses = Expenses.filter(
    exp => moment(exp.date).format('YYYY-MM-DD') === date,
  );

  // daily renderItem
  function renderItem({item}) {
    // const expenseAmount = currencyFormatter(item.expense_daily, {});
    // const incomeAmount = currencyFormatter(item.income_daily, {});
    const expenseAmount = item.amount;
    // const incomeAmount = item.amount;
    const accountId = item.accountId;
    const cateId = item.cateId;
    const itemId = item.id;
    // console.log(item);

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

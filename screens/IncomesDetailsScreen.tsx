import {FlatList, View} from 'react-native';
import React, {useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';

// import {currencyFormatter} from '../util/currencyFormatter';
import {useAppSelector} from '../hooks';
import DailyItemElement from '../components/Output/DailyItemElement';
import {IncomesDetailsNavigationProp, IncomesDetailsRouteProp} from '../types';

type Props = {
  navigation: IncomesDetailsNavigationProp;
  route: IncomesDetailsRouteProp;
};

// const {width, height} = Dimensions.get('window');

const IncomesDetailsScreen = ({route, navigation}: Props) => {
  // Get Category name in Storage
  const dataLoaded = useAppSelector(store => store);

  const Incomes = dataLoaded?.incomes?.incomes;

  const date = route.params.date;
  // const time = route.params.time;

  useEffect(() => {
    navigation.setOptions({
      title: 'Incomes',
      // headerTitleAlign: 'left',
      // headerTitleContainerStyle: {marginLeft: 0},
    });
  }, []);

  const filteredExpenses = Incomes.filter(
    income => moment(income.date).format('YYYY-MM-DD') === date,
  );

  // daily renderItem
  function renderItem({item}) {
    // const expenseAmount = currencyFormatter(item.expense_daily, {});
    // const incomeAmount = currencyFormatter(item.income_daily, {});
    // const expenseAmount = item.amount;
    const incomeAmount = item.amount;
    const accountId = item.accountId;
    const cateId = item.cateId;
    const itemId = item.id;
    const time = moment(item.date).format('LT');

    if (+incomeAmount === 0) {
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
        amount={incomeAmount}
        type={'income'}
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

export default IncomesDetailsScreen;

// const styles = StyleSheet.create({});

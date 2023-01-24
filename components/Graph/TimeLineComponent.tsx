import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import moment from 'moment';

import TimeLine from './TimeLine';
import {sumEachAccountId, sumTotalBudget, sumTotalFunc} from '../../util/math';
import {useAppDispatch, useAppSelector} from '../../hooks';

const {width} = Dimensions.get('window');

const TimeLineTab = ({data, fromDate, toDate}: Props) => {
  // const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const sumExpenseByEachAccount = sumEachAccountId(data);

  const accountsFiltered = dataLoaded?.accounts?.accounts?.filter(account => {
    const findItem = sumExpenseByEachAccount?.find(
      sum => sum.accountId === account?.id,
    );
    return findItem;
  });

  const mergeObj = accountsFiltered?.map(acc => {
    const Obj = sumExpenseByEachAccount?.find(sum => sum.accountId === acc.id);
    const newObj = {...acc, ...Obj};
    const deletedIdObj = Object.values([newObj])?.map(
      ({id, ...accountId}) => accountId,
    );
    return deletedIdObj[0];
  });

  const totalExpense = sumTotalFunc(data);
  const totalBudget = sumTotalBudget(mergeObj);

  const totalObj = [
    {
      accountId: 'tot1',
      amount: +totalExpense,
      budget: +totalBudget,
      title: 'Total',
    },
  ];

  //sort Data
  mergeObj?.sort((a: any, b: any) => {
    // const amountA = +a.budget;
    // const amountB = +b.budget;
    const amountA = +a.amount;
    const amountB = +b.amount;
    if (amountA > amountB) {
      return -1; // return -1 here for AESC order
    }
    return 1; // return 1 here for DESC Order
  });

  const RenderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Budgets</Text>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Text>{'( ' + moment(fromDate).format('DD MMM YYYY')} </Text>
          <Text> to </Text>
          <Text>{moment(toDate).format('DD MMM YYYY') + ' )'}</Text>
        </View>
      </View>
    );
  };

  const renderItem = item => {
    return (
      <View
        style={{
          width,
          height: 100,
        }}>
        <TimeLine
          item={item}
          totalExpense={item?.amount}
          widthBar={8}
          barColor={{remain: '#1a1a1a50', used: '#00b421'}}
          titleStyle={{fontSize: 16, fontWeight: 'bold'}}
          budgetStyle={{fontSize: 14}}
        />
      </View>
    );
  };

  const RenderCategoryList = () => {
    return (
      <View style={styles.budgetContainer}>
        {totalObj?.map(item => {
          return (
            <View
              key={item.accountId}
              style={{
                height: 100,
                marginBottom: 20,
              }}>
              <TimeLine
                item={item}
                totalExpense={item.amount}
                widthBar={14}
                barColor={{remain: '#cecece', used: '#026499'}}
                titleStyle={{fontSize: 16, fontWeight: 'bold'}}
                budgetStyle={{fontSize: 14, fontWeight: 'bold'}}
              />
            </View>
          );
        })}

        <FlatList
          keyExtractor={item => item.accountId}
          data={mergeObj}
          bounces={false}
          renderItem={({item}) => renderItem(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {<RenderHeader />}
      {<RenderCategoryList />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    // backgroundColor: '#d4d4d4',
  },
  budgetContainer: {
    flex: 1,
    width: '100%',
    height: 250,
    alignItems: 'center',
    marginTop: 10,
    // backgroundColor: '#67e1cf',
  },
});

export default TimeLineTab;

// =========================== TYPE ======================================
type Props = {
  fromDate: string;
  toDate: string;
};

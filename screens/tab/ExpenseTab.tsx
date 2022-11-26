import React, {useEffect} from 'react';

import ExpenseOutput from '../../components/Output/ExpenseOutput';
// import {EXPENSES} from '../../dummy/dummy';
import {useAppDispatch, useAppSelector} from '../../hooks';
// import {ExpenseType} from '../../models/expense';
import {fetchExpensesData} from '../../store/expense-action';
import {ExpenseTabRouteProp} from '../../types';

type Props = {
  route: ExpenseTabRouteProp;
};

const ExpenseTab = ({route}: Props) => {
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const expensesData = dataLoaded?.expenses?.expenses;

  // const [expensesData, setExpensesData] = useState<ExpenseType>();

  const fromDate = route.params?.fromDate;
  const toDate = route.params?.toDate;

  useEffect(() => {
    // setExpensesData(EXPENSES);
    dispatch(fetchExpensesData());
  }, []);

  if (expensesData === null || expensesData === undefined) {
    return;
  }

  return (
    <ExpenseOutput data={expensesData} fromDate={fromDate} toDate={toDate} />
  );
};

export default ExpenseTab;

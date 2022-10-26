import React, {useEffect, useState} from 'react';

import ExpenseOutput from '../../components/Output/ExpenseOutput';
import {EXPENSES} from '../../dummy/dummy';

type Props = {};

const Expense = ({route}: Props) => {
  const [expensesData, setExpensesData] = useState();

  const fromDate = route.params?.fromDate;
  const toDate = route.params?.toDate;

  useEffect(() => {
    setExpensesData(EXPENSES);
  }, []);

  if (expensesData === null || expensesData === undefined) {
    return;
  }

  return (
    <ExpenseOutput data={expensesData} fromDate={fromDate} toDate={toDate} />
  );
};

export default Expense;

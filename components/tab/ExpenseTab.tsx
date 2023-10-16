import React, {useContext} from 'react';

import ExpenseOutput from '../Output/ExpenseOutput';
// import {EXPENSES} from '../../dummy/dummy';
// import {useAppSelector} from '../../hooks';
// import {ExpenseType} from '../../models/expense';
// import {fetchExpensesData} from '../../store/expense-action';
// import {ExpenseTabRouteProp} from '../../types';
import OverviewContext from '../../store-context/overview-context';

// type Props = {
  // focusedTabIndex: number;
// };

const ExpenseTab = ({}) => {
  // useEffect(() => {}, [focusedTabIndex]);
  // const dispatch = useAppDispatch();
  // const dataLoaded = useAppSelector(store => store);

  // const expensesData = dataLoaded?.expenses?.expenses;

  const overviewCtx = useContext(OverviewContext);
  const fromDate = overviewCtx?.fromDate;
  const toDate = overviewCtx?.toDate;

  return (
    <ExpenseOutput
      // data={expensesData}
      fromDate={fromDate}
      toDate={toDate}
      // focusedTabIndex={focusedTabIndex}
    />
  );
};

export default ExpenseTab;

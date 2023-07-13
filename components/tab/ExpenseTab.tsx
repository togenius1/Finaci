import React, {useContext} from 'react';

import ExpenseOutput from '../Output/ExpenseOutput';
// import {EXPENSES} from '../../dummy/dummy';
import {useAppSelector} from '../../hooks';
// import {ExpenseType} from '../../models/expense';
// import {fetchExpensesData} from '../../store/expense-action';
import {ExpenseTabRouteProp} from '../../types';
import OverviewContext from '../../store-context/overview-context';

type Props = {
  route: ExpenseTabRouteProp;
};

const ExpenseTab = ({}: Props) => {
  // const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const expensesData = dataLoaded?.expenses?.expenses;

  // const [expensesData, setExpensesData] = useState<ExpenseType>();

  // const fromDate = route.params?.fromDate;
  // const toDate = route.params?.toDate;
  const overviewCtx = useContext(OverviewContext);
  const fromDate = overviewCtx?.fromDate;
  const toDate = overviewCtx?.toDate;

  // useEffect(() => {
  // setExpensesData(EXPENSES);
  // dispatch(fetchExpensesData());
  // }, []);

  // if (expensesData === null || expensesData === undefined) {
  //   return;
  // }

  return (
    <ExpenseOutput data={expensesData} fromDate={fromDate} toDate={toDate} />
  );
};

export default ExpenseTab;

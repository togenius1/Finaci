import {useReducer} from 'react';
import moment from 'moment';

import TransactContext from './transact-context';

const initialStartDate = moment(`${moment().year()}-01-01`).format(
  'YYYY-MM-DD',
);
const initialToDate = moment(`${moment().year()}-12-31`).format('YYYY-MM-DD');

const defaultTransactState = {
  fromDate: initialStartDate,
  toDate: initialToDate,
  monthlyPressed: true,
  weeklyPressed: false,
  dailyPressed: false,
  customPressed: false,
  exportPressed: false,
};

const TransactReducer = (state, action) => {
  if (action.type === 'TAB_PRESSED') {
    const updatedMonthlyPressed = action.item.monthlyPressed;
    const updatedWeeklyPressed = action.item.weeklyPressed;
    const updatedDailyPressed = action.item.dailyPressed;
    const updatedCustomPressed = action.item.customPressed;
    const updatedExportPressed = action.item.exportPressed;
    return {
      ...state,
      monthlyPressed: updatedMonthlyPressed,
      weeklyPressed: updatedWeeklyPressed,
      dailyPressed: updatedDailyPressed,
      customPressed: updatedCustomPressed,
      exportPressed: updatedExportPressed,
    };
  }
  if (action.type === 'SET_FROM_DATE') {
    // console.log('from date action', action.item);
    const updatedFromDate = action.item.fromDate;
    // console.log('update fromDate: ', updatedFromDate);
    return {
      ...state,
      fromDate: updatedFromDate,
    };
  }
  if (action.type === 'SET_TO_DATE') {
    const updatedToDate = action.item.toDate;
    return {
      ...state,
      toDate: updatedToDate,
    };
  }

  return defaultTransactState;
};

const TransactProvider = props => {
  const [transactState, dispatchTransactAction] = useReducer(
    TransactReducer,
    defaultTransactState,
  );

  const tabPressedHandler = item => {
    dispatchTransactAction({type: 'TAB_PRESSED', item: item});
  };

  const fromDateSetHandler = item => {
    dispatchTransactAction({type: 'SET_FROM_DATE', item: item});
  };

  const toDateSetHandler = item => {
    dispatchTransactAction({type: 'SET_TO_DATE', item: item});
  };

  const cartContext = {
    fromDate: transactState.fromDate,
    toDate: transactState.toDate,
    monthlyPressed: transactState.monthlyPressed,
    weeklyPressed: transactState.weeklyPressed,
    dailyPressed: transactState.dailyPressed,
    customPressed: transactState.customPressed,
    exportPressed: transactState.exportPressed,
    tabPressedHandler: tabPressedHandler,
    fromDateSetHandler: fromDateSetHandler,
    toDateSetHandler: toDateSetHandler,
  };

  return (
    <TransactContext.Provider value={cartContext}>
      {props.children}
    </TransactContext.Provider>
  );
};

export default TransactProvider;

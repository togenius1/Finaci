import {useReducer} from 'react';
import moment from 'moment';

import OverviewContext from './overview-context';

const initialStartDate = moment(`${moment().year()}-01-01`).format(
  'YYYY-MM-DD',
);
const initialToDate = moment(`${moment().year()}-12-31`).format('YYYY-MM-DD');

const defaultTransactState = {
  fromDate: initialStartDate,
  toDate: initialToDate,
};

const OverviewReducer = (state, action) => {
  if (action.type === 'SET_FROM_DATE') {
    const updatedFromDate = action.item.fromDate;
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

const OverviewProvider = props => {
  const [transactState, dispatchTransactAction] = useReducer(
    OverviewReducer,
    defaultTransactState,
  );

  const fromDateSetHandler = item => {
    dispatchTransactAction({type: 'SET_FROM_DATE', item: item});
  };

  const toDateSetHandler = item => {
    dispatchTransactAction({type: 'SET_TO_DATE', item: item});
  };

  const overviewContext = {
    fromDate: transactState.fromDate,
    toDate: transactState.toDate,
    fromDateSetHandler: fromDateSetHandler,
    toDateSetHandler: toDateSetHandler,
  };

  return (
    <OverviewContext.Provider value={overviewContext}>
      {props.children}
    </OverviewContext.Provider>
  );
};

export default OverviewProvider;

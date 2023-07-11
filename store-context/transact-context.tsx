import React from 'react';
import moment from 'moment';

const initialStartDate = moment(`${moment().year()}-01-01`).format(
  'YYYY-MM-DD',
);
const initialToDate = moment(`${moment().year()}-12-31`).format('YYYY-MM-DD');

const TransactContext = React.createContext({
  fromDate: initialStartDate,
  toDate: initialToDate,
  monthlyPressed: true,
  weeklyPressed: false,
  dailyPressed: false,
  customPressed: false,
  exportPressed: false,
  tabPressedHandler: item => {},
  fromDateSetHandler: item => {},
  toDateSetHandler: item => {},
});

export default TransactContext;

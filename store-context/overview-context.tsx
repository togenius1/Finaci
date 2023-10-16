import React from 'react';
import moment from 'moment';

const initialStartDate = moment(`${moment().year()}-01-01`).format(
  'YYYY-MM-DD',
);
const initialToDate = moment(`${moment().year()}-12-31`).format('YYYY-MM-DD');

const OverviewContext = React.createContext({
  fromDate: initialStartDate,
  toDate: initialToDate,
  fromDateSetHandler: item => {},
  toDateSetHandler: item => {},
});

export default OverviewContext;

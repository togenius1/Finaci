import moment from 'moment';

// Initial transaction
export const initialWeekTransactions = [
  {
    date: moment().format('YYYY-MM-DD'),
    id: 'transId1',
    week: 1,
    expense_weekly: 0,
    income_weekly: 0,
  },
  {
    date: moment().format('YYYY-MM-DD'),
    id: 'transId2',
    week: 2,
    expense_weekly: 0,
    income_weekly: 0,
  },
  {
    date: moment().format('YYYY-MM-DD'),
    id: 'transId3',
    week: 3,
    expense_weekly: 0,
    income_weekly: 0,
  },
  {
    date: moment().format('YYYY-MM-DD'),
    id: 'transId4',
    week: 4,
    expense_weekly: 0,
    income_weekly: 0,
  },
  {
    date: moment().format('YYYY-MM-DD'),
    id: 'transId5',
    week: 5,
    expense_weekly: 0,
    income_weekly: 0,
  },
];

// Week Transaction
export const weekTransactions = [
  {
    date: '2022-10-01',
    id: 'transId1',
    week: 1,
    expense_weekly: 1304.7,
    income_weekly: 13500,
  },
  {
    date: '2022-10-01',
    id: 'transId2',
    week: 2,
    expense_weekly: 1304.7,
    income_weekly: 2500,
  },
  {
    date: '2022-10-01',
    id: 'transId3',
    week: 3,
    expense_weekly: 1304.7,
    income_weekly: 63500,
  },
  {
    date: '2022-10-01',
    id: 'transId4',
    week: 4,
    expense_weekly: 1304.7,
    income_weekly: 23500,
  },
  {
    date: '2022-10-01',
    id: 'transId5',
    week: 5,
    expense_weekly: 1250,
    income_weekly: 11500,
  },
  {
    date: '2022-11-01',
    id: 'transId6',
    week: 1,
    expense_weekly: 1304.7,
    income_weekly: 0,
  },
  {
    date: '2022-11-01',
    id: 'transId7',
    week: 2,
    expense_weekly: 848.2,
    income_weekly: 25100,
  },
  {
    date: '2022-11-01',
    id: 'transId8',
    week: 3,
    expense_weekly: 1752.7,
    income_weekly: 0,
  },

  {
    date: '2022-11-01',
    id: 'transId9',
    week: 4,
    expense_weekly: 1003,
    income_weekly: 3000,
  },

  {
    date: '2022-11-01',
    id: 'transId10',
    week: 5,
    expense_weekly: 500,
    income_weekly: 500,
  },
];

import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

import {EXPENSES, INCOME} from '../dummy/dummy';
import {sumByCustomDate, sumByDate, sumByMonth, sumByWeek} from './math';

///////////////////////////// Monthly Transaction ///////////////////////////////////
export function monthlyTransaction(
  fromDate: string,
  toDate: string,
  year: string,
) {
  const selectedDurationExpenseData = EXPENSES?.filter(
    expense =>
      new Date(expense.date) >= new Date(String(fromDate)) &&
      new Date(expense.date) <= new Date(String(toDate)),
  );
  const selectedDurationIncomeData = INCOME?.filter(
    income =>
      new Date(income.date) >= new Date(String(fromDate)) &&
      new Date(income.date) <= new Date(String(toDate)),
  );

  // Combine data and sum by monthly
  const sumExpenseByMonth = sumByMonth(selectedDurationExpenseData, 'expense');
  const sumIncomeByMonth = sumByMonth(selectedDurationIncomeData, 'income');
  const data2 = [...sumExpenseByMonth, ...sumIncomeByMonth];
  const monthlyData = Object.values(
    data2.reduce((acc, cur) => {
      if (!acc[cur?.month]) {
        const date = moment(`${year}-${cur.month}-01`).format('YYYY-MM-DD');
        acc[cur?.month] = {Month: cur.month, Date: date, Finance: []};
      }
      acc[cur?.month].Finance.push(cur);
      return acc;
    }, {}),
  );
  return monthlyData;
}

///////////////////////////// Weekly Transaction ///////////////////////////////////
export function weeklyTransaction(
  fromDate: string,
  toDate: string,
  date: string,
) {
  const selectedDurationExpenseData = EXPENSES?.filter(
    expense =>
      new Date(expense.date) >= new Date(String(fromDate)) &&
      new Date(expense.date) <= new Date(String(toDate)),
  );
  const selectedDurationIncomeData = INCOME?.filter(
    income =>
      new Date(income.date) >= new Date(String(fromDate)) &&
      new Date(income.date) <= new Date(String(toDate)),
  );

  const sumExpenseByWeek = sumByWeek(
    selectedDurationExpenseData,
    'expense',
    date,
  );
  const sumIncomeByWeek = sumByWeek(selectedDurationIncomeData, 'income', date);
  const data3 = [...sumExpenseByWeek, ...sumIncomeByWeek];
  // const selectedMonth = moment(fromDate).month() + 1;
  const weeklyData = Object.values(
    data3.reduce((acc, cur) => {
      if (!acc[cur?.week]) {
        acc[cur?.week] = {Week: cur?.week, Finance: [], Date: fromDate};
      }
      acc[cur?.week].Finance.push(cur);
      return acc;
    }, {}),
  );
  return weeklyData;
}

///////////////////////////// Weekly Transaction ///////////////////////////////////
export function dailyTransaction(
  fromDate: string,
  toDate: string,
  date: string,
) {
  const selectedDurationExpenseData = EXPENSES?.filter(
    expense =>
      new Date(expense.date) >= new Date(String(fromDate)) &&
      new Date(expense.date) <= new Date(String(toDate)),
  );
  const selectedDurationIncomeData = INCOME?.filter(
    income =>
      new Date(income.date) >= new Date(String(fromDate)) &&
      new Date(income.date) <= new Date(String(toDate)),
  );

  const sumExpenseByDate = sumByDate(
    selectedDurationExpenseData,
    'expense',
    date,
  );
  const sumIncomeByDate = sumByDate(selectedDurationIncomeData, 'income', date);
  const data = [...sumExpenseByDate, ...sumIncomeByDate];
  const dailyData = Object.values(
    data.reduce((acc, cur) => {
      if (!acc[cur?.day])
        acc[cur?.day] = {Day: cur?.day, Date: cur?.date, Finance: []};
      acc[cur?.day].Finance.push(cur);
      return acc;
    }, {}),
  );
  return dailyData;
}

///////////////////////////// Custom Transaction ///////////////////////////////////
// export function customTransaction(
//   fromDate: string,
//   toDate: string,
//   selectedDurationExpenseData,
//   selectedDurationIncomeData,
// ) {
//   const sumExpenseByCustomDate = sumByCustomDate(
//     selectedDurationExpenseData,
//     'expense',
//     fromDate,
//     toDate,
//   );
//   const sumIncomeByCustomDate = sumByCustomDate(
//     selectedDurationIncomeData,
//     'income',
//     fromDate,
//     toDate,
//   );
//   const data4 = [...sumExpenseByCustomDate, ...sumIncomeByCustomDate];
//   const customData = Object.values(
//     data4.reduce((acc, cur) => {
//       if (!acc[cur?.day])
//         acc[cur?.day] = {
//           Day: cur?.day,
//           Date: cur?.date,
//           id: uuidv4(),
//           Finance: [],
//         };
//       acc[cur?.day].Finance.push(cur);
//       return acc;
//     }, {}),
//   );
//   return customData;
// }

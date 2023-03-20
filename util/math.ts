import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import {getWeekInMonth} from './date';

//sort Data by day
export function sortDataByDay(obj) {
  obj?.sort((a: any, b: any) => {
    const dateA = a.Day;
    const dateB = b.Day;
    if (dateA > dateB) {
      return -1; // return -1 here for DESC order
    }
    return 1; // return 1 here for DESC Order
  });
}

// Sum all category
export function sumTotalFunc(obj) {
  const total_sum = obj?.reduce((sum, numObj) => {
    return sum + +numObj.amount;
  }, 0);

  return total_sum;
}

// Sum all budget
export function sumTotalBudget(obj) {
  const total_sum = obj?.reduce((sum, numObj) => {
    return sum + +numObj.budget;
  }, 0);

  return total_sum;
}

// SUM for each account Id
export function sumEachAccountId(obj) {
  let result = [];
  obj.reduce(function (res, value) {
    if (!res[value.accountId]) {
      res[value.accountId] = {accountId: value.accountId, amount: 0};
      result.push(res[value.accountId]);
    }
    res[value.accountId].amount += +value.amount;
    return res;
  }, {});
  return result;
}

// SUM for each category Id
export function sumEachCategoryId(obj) {
  let result = [];
  obj.reduce(function (res, value) {
    if (!res[value.cateId]) {
      res[value.cateId] = {cateId: value.cateId, amount: 0};
      result.push(res[value.cateId]);
    }
    res[value.cateId].amount += +value.amount;
    return res;
  }, {});
  return result;
}

// Calculate for PCT of Each Expense Category
export function calPctEachCategoryId(obj, total, cateObj) {
  // let result = [];
  let pct = [];
  obj.reduce(function (res, value) {
    if (!res[value.cateId]) {
      res[value.cateId] = {cateId: value.cateId, amount: 0};
      // result.push(res[value.cateId]);
    }
    res[value.cateId].amount += +value.amount;
    res[value.cateId] = {
      id: uuidv4(),
      title: cateObj?.find(cate => cate.id === value.cateId)?.title,
      amount: res[value.cateId].amount,
      percentage: res[value.cateId]?.amount / total,
    };
    pct.push(res[value.cateId]);
    return res;
  }, {});
  const pctFiltered = pct?.filter(pc => pc !== undefined);
  return pctFiltered;
}

// SUMMATION  by MONTH
export function sumByMonth(object, type) {
  let results = [];

  const expenseId = Array.from({length: 12}, (_, i) => `e${i + 1}`);

  const incomeId = Array.from({length: 12}, (_, i) => `i${i + 1}`);

  results = [
    {month: 1, amount: 0},
    {month: 2, amount: 0},
    {month: 3, amount: 0},
    {month: 4, amount: 0},
    {month: 5, amount: 0},
    {month: 6, amount: 0},
    {month: 7, amount: 0},
    {month: 8, amount: 0},
    {month: 9, amount: 0},
    {month: 10, amount: 0},
    {month: 11, amount: 0},
    {month: 12, amount: 0},
  ];

  if (type === 'expense') {
    results = results.map((result, index) => ({
      ...result,
      id: expenseId[index],
    }));
  }
  if (type === 'income') {
    results = results.map((result, index) => ({
      ...result,
      id: incomeId[index],
    }));
  }

  const mapDayToMonth = object?.map(obj => ({
    ...obj,
    id: obj.id,
    month: moment(obj?.date).month(),
    amount: Number(obj?.amount),
  }));

  const sumPerMonth = mapDayToMonth?.reduce((acc, cur) => {
    acc[cur.month] = acc[cur.month] + +cur.amount || cur.amount; // increment or initialize to cur.value
    results[cur.month] = {
      id: results[cur.month].id,
      month: cur.month + 1,
      amount: acc[cur.month],
    };
    return acc;
  }, new Array(12).fill(0));
  const resultFiltered = results?.filter(result => result !== undefined);
  return resultFiltered;
}

// SUMMATION  by Custom MONTH
export function sumByCustomMonth(
  object: any[],
  type: string,
  fromDate: string,
  toDate: string,
) {
  let results = [];

  let objLength = moment(toDate).month() + 1;

  const expenseId = Array.from({length: objLength}, (_, i) => `e${i + 1}`);

  const incomeId = Array.from({length: objLength}, (_, i) => `i${i + 1}`);

  results = Array.from({length: objLength}, (_, i) => {
    let fromMonth = moment(fromDate).month() + 1;
    let month = i + fromMonth;
    if (month < 10) {
      month = `0${month}`;
    }
    // eval convert string to object
    return eval('(' + `{month:${i + fromMonth}, amount: 0}` + ')');
  });

  if (type === 'expense') {
    results = results.map((result, index) => ({
      ...result,
      id: expenseId[index],
    }));
  }
  if (type === 'income') {
    results = results.map((result, index) => ({
      ...result,
      id: incomeId[index],
    }));
  }

  const mapDayToMonth = object?.map(obj => ({
    ...obj,
    id: obj.id,
    month: moment(obj.date).month(),
    amount: Number(obj.amount),
  }));

  const sumPerMonth = mapDayToMonth.reduce((acc, cur) => {
    acc[cur.month] = acc[cur.month] + +cur.amount || cur.amount; // increment or initialize to cur.value
    results[cur.month] = {
      id: results[cur.month]?.id,
      month: cur.month + 1,
      amount: acc[cur.month],
    };
    return acc;
  }, {});
  const resultFiltered = results?.filter(result => result !== undefined);
  return resultFiltered;
}

// SUMMATION by WEEK
export function sumByWeek(object, type, date) {
  let month = moment(date).month() + 1;
  if (month < 10) {
    month = `0${month}`;
  }

  let results = [];
  const expenseId = ['e1', 'e2', 'e3', 'e4', 'e5'];
  const incomeId = ['i1', 'i2', 'i3', 'i4', 'i5'];
  results = [
    {week: 1, amount: 0},
    {week: 2, amount: 0},
    {week: 3, amount: 0},
    {week: 4, amount: 0},
    {week: 5, amount: 0},
  ];

  if (type === 'expense') {
    results = results.map((result, index) => ({
      ...result,
      id: expenseId[index],
    }));
  }
  if (type === 'income') {
    results = results.map((result, index) => ({
      ...result,
      id: incomeId[index],
    }));
  }

  const mapDayToWeek = object.map(obj => ({
    ...obj,
    // id: obj.id,
    week: getWeekInMonth(
      moment(obj.date).year(),
      moment(obj.date).month() + 1,
      moment(obj.date).date(),
    ),
    // date: obj.date,
  }));

  const sumPerWeek = mapDayToWeek.reduce((acc, cur) => {
    acc[cur.week - 1] = acc[cur.week - 1] + +cur.amount || +cur.amount; // increment or initialize to cur.value
    results[cur.week - 1] = {
      id: results[cur.week - 1]?.id,
      week: cur.week,
      amount: acc[cur.week - 1],
    };
    return acc;
  }, {});
  const resultFiltered = results?.filter(result => result !== undefined);
  return resultFiltered;
}

// SUMMATION by DATE
export function sumByDate(object, type, date) {
  let results;
  let month = moment(date).month() + 1;
  let year = moment(date).year();

  if (month < 10) {
    month = `0${month}`;
  }

  const expenseId = Array.from(
    {length: moment(month).daysInMonth()},
    (_, i) => `e${i + 1}`,
  );

  const incomeId = Array.from(
    {length: moment(month).daysInMonth()},
    (_, i) => `i${i + 1}`,
  );

  results = Array.from({length: moment(date).daysInMonth()}, (_, i) => {
    let day = i + 1;
    if (day < 10) {
      day = `0${day}`;
    }
    // eval convert string to object
    return eval(
      '(' +
        `{day:${i + 1}, amount: 0, date: ${year}+"-"+${JSON.stringify(
          month,
        )}+"-"+${JSON.stringify(day)}}` +
        ')',
    );
  });

  if (type === 'expense') {
    results = results?.map((result, index) => ({
      ...result,
      id: expenseId[index],
      accountId: `accountId${index + 1}`,
    }));
  }
  if (type === 'income') {
    results = results?.map((result, index) => ({
      ...result,
      id: incomeId[index],
      accountId: `accountId${index + 1}`,
    }));
  }

  const mapDayToDay = object?.map((obj, index) => ({
    ...obj,
    // id: obj.id,
    day: moment(obj.date).date(),
  }));

  const sumPerDay = mapDayToDay.reduce((acc, cur) => {
    acc[cur.day - 1] = acc[cur.day - 1] + +cur.amount || +cur.amount; // increment or initialize to cur.value
    results[cur.day - 1] = {
      id: cur.id,
      cateId: cur.cateId,
      accountId: cur.accountId,
      day: cur.day,
      date: moment(cur.date).format('YYYY-MM-DD'),
      amount: +acc[cur.day - 1],
      // cateId: cur.cateId,
    };
    return acc;
  }, {});
  // }, new Array(moment(date).daysInMonth()).fill(0));
  return results;
}

// SUMMATION by Custom date
export function sumByCustomDate(object, type, fromDate, toDate) {
  const year = moment(fromDate).year();
  let m = moment(fromDate).month() + 1;

  const monthDiff = moment(toDate).diff(fromDate, 'months');
  const monthObject = Array.from({length: monthDiff + 1}, (_, i) => i + m);

  let results = [];
  monthObject?.forEach((element, index) => {
    if (element < 10) {
      element = `0${element}`;
    }
    const fDate = moment(fromDate).format(`${year}-${element}-01`);
    const sum = sumByDate(object, type, moment(fDate));
    results = Object.assign(results, sum);
  });

  return results;
}

// SUMMATION  by MONTHLY Transaction
// object[0] -> income
// object[1] -> expense
export function sumTransactionByMonth(object) {
  let results = [];

  const Id_index = Array.from({length: 12}, (_, i) => `ei${i + 1}`);

  // const incomeId = Array.from({length: 12}, (_, i) => `i${i + 1}`);

  // if (type === 'expense') {
  results = [
    {month: 1, expense_monthly: 0, income_monthly: 0},
    {month: 2, expense_monthly: 0, income_monthly: 0},
    {month: 3, expense_monthly: 0, income_monthly: 0},
    {month: 4, expense_monthly: 0, income_monthly: 0},
    {month: 5, expense_monthly: 0, income_monthly: 0},
    {month: 6, expense_monthly: 0, income_monthly: 0},
    {month: 7, expense_monthly: 0, income_monthly: 0},
    {month: 8, expense_monthly: 0, income_monthly: 0},
    {month: 9, expense_monthly: 0, income_monthly: 0},
    {month: 10, expense_monthly: 0, income_monthly: 0},
    {month: 11, expense_monthly: 0, income_monthly: 0},
    {month: 12, expense_monthly: 0, income_monthly: 0},
  ];

  // if (type === 'expense') {
  results = results.map((result, index) => ({
    ...result,
    id: Id_index[index],
  }));

  const mapDayToMonth = object?.map(obj => ({
    ...obj[1],
    id: obj[1].id,
    month: moment(obj?.date).month(),
    income_monthly: Number(obj[0]?.amount),
    expense_monthly: Number(obj[1]?.amount),
  }));

  console.log('mapDayToMonth: ', mapDayToMonth);
  console.log('Length1, Length2: ', object[0]?.length, object[1]?.length);

  const sumPerMonth = mapDayToMonth?.reduce((acc, cur) => {
    acc[cur.month] =
      acc[cur.month] + +cur?.expense_monthly || +cur?.expense_monthly; // increment or initialize to cur.value

    // console.log(acc[cur.month]);
    // results[cur.month] = {
    //   id: results[cur.month].id,
    //   date: new Date(),
    //   month: cur.month + 1,
    //   income_monthly: acc[cur.month],
    //   expense_monthly: acc[cur.month],
    // };

    return acc;
  }, new Array(12).fill(0));
  const resultFiltered = results?.filter(result => result !== undefined);
  return resultFiltered;
}

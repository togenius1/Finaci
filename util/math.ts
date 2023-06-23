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
  obj?.reduce(function (res, value) {
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
// **** object have to be filtered by year and month first ****
export function sumByWeek(object, type, date = '') {
  // const yearOfAmount = moment(date).year();
  // const monthOfAmount = moment(date).month() + 1;
  // const dateOfAmount = moment(date).date();
  // const weekOfAmount = getWeekInMonth(
  //   yearOfAmount,
  //   monthOfAmount,
  //   dateOfAmount,
  // );
  // let month = moment(date).month() + 1;
  // if (month < 10) {
  //   month = `0${month}`;
  // }

  let results = [];
  const expenseId = ['e1', 'e2', 'e3', 'e4', 'e5'];
  const incomeId = ['i1', 'i2', 'i3', 'i4', 'i5'];
  results = [
    {week: 1, amount: 0, month: '', year: ''},
    {week: 2, amount: 0, month: '', year: ''},
    {week: 3, amount: 0, month: '', year: ''},
    {week: 4, amount: 0, month: '', year: ''},
    {week: 5, amount: 0, month: '', year: ''},
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

  const mapDayToWeek = object?.map(obj => ({
    ...obj,
    // id: obj.id,
    week: getWeekInMonth(
      moment(obj.date).year(),
      moment(obj.date).month() + 1,
      moment(obj.date).date(),
    ),
  }));

  const sumPerWeek = mapDayToWeek.reduce((acc, cur) => {
    acc[cur.week - 1] = acc[cur.week - 1] + +cur.amount || +cur.amount; // increment or initialize to cur.value

    results[cur.week - 1] = {
      id: 'week-' + cur.week,
      week: cur.week,
      amount: acc[cur.week - 1],
      month: moment(cur.date).month() + 1,
      year: moment(cur.date).year(),
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

  const sumPerDay = mapDayToDay?.reduce((acc, cur) => {
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

// Monthly Function
export function sumTransactionByMonth(object: any) {
  let results = [];

  results = [
    {id: 'ei1', month: 1, expense_monthly: 0, income_monthly: 0},
    {id: 'ei2', month: 2, expense_monthly: 0, income_monthly: 0},
    {id: 'ei3', month: 3, expense_monthly: 0, income_monthly: 0},
    {id: 'ei4', month: 4, expense_monthly: 0, income_monthly: 0},
    {id: 'ei5', month: 5, expense_monthly: 0, income_monthly: 0},
    {id: 'ei6', month: 6, expense_monthly: 0, income_monthly: 0},
    {id: 'ei7', month: 7, expense_monthly: 0, income_monthly: 0},
    {id: 'ei8', month: 8, expense_monthly: 0, income_monthly: 0},
    {id: 'ei9', month: 9, expense_monthly: 0, income_monthly: 0},
    {id: 'ei10', month: 10, expense_monthly: 0, income_monthly: 0},
    {id: 'ei11', month: 11, expense_monthly: 0, income_monthly: 0},
    {id: 'ei12', month: 12, expense_monthly: 0, income_monthly: 0},
  ];

  // Income Month
  const mapIncomeToMonth = object[0]?.map(obj => ({
    ...obj,
    // id: obj[0].id,
    month: +moment(obj?.date).month(),
  }));

  // Expense Month
  const mapExpenseToMonth = object[1]?.map(obj => ({
    ...obj,
    // id: obj[0].id,
    month: +moment(obj?.date).month(),
  }));

  // Combine expense and income arrays
  const expenseIncome = [mapIncomeToMonth, mapExpenseToMonth];

  // ******* Try This:
  // https://stackoverflow.com/questions/30667121/javascript-sum-multidimensional-array
  // Sum Expense and Income for each month
  const sumExInForMonth = expenseIncome
    .reduce((a, b) => a.concat(b))
    .reduce((a, b) => {
      const idx = a.findIndex(
        elem =>
          elem.month === b.month &&
          moment(elem.date).year() === moment(b.date).year() &&
          elem.id.split('-')[0] === b.id.split('-')[0],
      );

      if (~idx) {
        a[idx].amount += b.amount;
      } else {
        a.push(JSON.parse(JSON.stringify(b)));
      }
      return a;
    }, []);

  // Group
  const groupByMonth = sumExInForMonth?.reduce(function (rv, x) {
    (rv[x['month']] = rv[x['month']] || []).push(x);
    return rv;
  }, {});

  for (let i = 0; i < Object.keys(groupByMonth).length; i++) {
    results[groupByMonth[i][0].month] = {
      id: 'transId' + `${groupByMonth[i][0].month + 1}`,
      date: groupByMonth[i][0].date,
      month: groupByMonth[i][0].month + 1,
      expense_monthly: +groupByMonth[i][1].amount,
      income_monthly: +groupByMonth[i][0].amount,
    };
  }

  const resultFiltered = results?.filter(result => result !== undefined);
  return resultFiltered;
}

// Weekly Function
export function sumTransactionByWeek(object) {
  let results: any = [];

  const Id = Array.from({length: 52}, (_, i) => `transId${i + 1}`);
  const week = Array.from({length: 52}, (_, i) => `${i + 1}`);
  results = Array.from({length: 52}, (_, i) => 0);

  results = results?.map((result, index) => ({
    ...result,
    id: Id[index],
    week: 0,
    weekInYear: +week[index],
    income_weekly: 0,
    expense_weekly: 0,
  }));

  // Income Week
  const mapIncomeToWeek = object[0]?.map(obj => ({
    ...obj,
    // id: obj[0].id,
    week: getWeekInMonth(
      moment(obj.date).year(),
      moment(obj.date).month() + 1,
      moment(obj.date).date(),
    ),
  }));

  // Expense Week
  const mapExpenseToWeek = object[1]?.map(obj => ({
    ...obj,
    // id: obj[0].id,
    week: getWeekInMonth(
      moment(obj?.date).year(),
      moment(obj?.date).month() + 1,
      moment(obj?.date).date(),
    ),
  }));

  // Combine expense and income arrays
  const expenseIncome = [mapIncomeToWeek, mapExpenseToWeek];

  // ******* Try This:
  // https://stackoverflow.com/questions/30667121/javascript-sum-multidimensional-array
  // Sum Expense and Income for each month
  const sumExInForWeek = expenseIncome
    .reduce((a, b) => a.concat(b))
    .reduce((a, b) => {
      const idx = a.findIndex(
        elem =>
          elem.week === b.week &&
          moment(elem.date).year() === moment(b.date).year() &&
          moment(elem.date).month() === moment(b.date).month() &&
          elem.id.split('-')[0] === b.id.split('-')[0],
      );

      if (~idx) {
        a[idx].amount += b?.amount;
      } else {
        a.push(JSON.parse(JSON.stringify(b)));
      }
      return a;
    }, []);

  // Group by Week
  const groupByWeek = sumExInForWeek.reduce(function (acc, cur) {
    // create a composed key: 'year-week'
    // to group expenses and incomes
    const yearWeek = `${moment(cur.date).year()}-${moment(cur.date).week()}`;

    // add this key as a property to the result object
    if (!acc[yearWeek]) {
      acc[yearWeek] = [];
    }

    // push the current date that belongs to the year-week calculated befor
    acc[yearWeek].push(cur);

    return acc;
  }, {});

  // Final result that match with transaction-slice

  Object.keys(groupByWeek).forEach(key => {
    const weekInYear = key.split('-');

    if (
      groupByWeek[key][1] === undefined &&
      groupByWeek[key][0] !== undefined
    ) {
      const Id = groupByWeek[key][0]?.id?.split('-');

      results[+weekInYear[1] - 1] = {
        id: 'transId' + `${+weekInYear[1]}`,
        date: groupByWeek[key][0].date,
        week: +groupByWeek[key][0].week, // week of month
        // weekInYear: +weekInYear[1],
        income_weekly: Id[0] === 'income' ? +groupByWeek[key][0]?.amount : 0,
        expense_weekly: Id[0] === 'expense' ? +groupByWeek[key][0]?.amount : 0,
      };
    } else {
      results[+weekInYear[1] - 1] = {
        id: 'transId' + `${+weekInYear[1]}`,
        date: groupByWeek[key][0].date,
        week: +groupByWeek[key][0].week, // week of month
        // weekInYear: +weekInYear[1],
        income_weekly:
          groupByWeek[key][0]?.amount !== undefined
            ? +groupByWeek[key][0]?.amount
            : 0,
        expense_weekly:
          groupByWeek[key][1]?.amount !== undefined
            ? +groupByWeek[key][1]?.amount
            : 0,
      };
    }
  });

  return results;
}

// Daily Function
export function sumTransactionByDay(object) {
  let results: any = [];

  const Id = Array.from({length: 366}, (_, i) => `transId${i + 1}`);
  const day = Array.from({length: 366}, (_, i) => `${i + 1}`);
  results = Array.from({length: 366}, (_, i) => 0);

  results = results?.map((result, index) => ({
    ...result,
    id: Id[index],
    date: '',
    day: 0,
    dayInYear: +day[index],
    income_weekly: 0,
    expense_weekly: 0,
  }));

  // Income Week
  const mapIncomeToDay = object[0]?.map(obj => ({
    ...obj,
    // id: obj[0].id,
    day: moment(obj.date).date(),
  }));

  // Expense Week
  const mapExpenseToDay = object[1]?.map(obj => ({
    ...obj,
    // id: obj[0].id,
    day: moment(obj.date).date(),
  }));

  // Combine expense and income arrays
  const expenseIncome = [mapIncomeToDay, mapExpenseToDay];

  // ******* Try This:
  // https://stackoverflow.com/questions/30667121/javascript-sum-multidimensional-array
  // Sum Expense and Income for each month
  const sumExInForDay = expenseIncome
    .reduce((a, b) => a.concat(b))
    .reduce((a, b) => {
      const idx = a.findIndex(
        elem =>
          elem.day === b.day &&
          moment(elem.date).year() === moment(b.date).year() &&
          moment(elem.date).month() === moment(b.date).month() &&
          elem.id.split('-')[0] === b.id.split('-')[0],
      );

      if (~idx) {
        a[idx].amount += b.amount;
      } else {
        a.push(JSON.parse(JSON.stringify(b)));
      }
      return a;
    }, []);

  // Group by Day
  const groupByDay = sumExInForDay.reduce(function (acc, cur) {
    // create a composed key: 'year-month'
    // to group expenses and incomes
    const yearDay = `${moment(cur.date).year()}-${moment(
      cur.date,
    ).dayOfYear()}`;

    // add this key as a property to the result object
    if (!acc[yearDay]) {
      acc[yearDay] = [];
    }

    // push the current date that belongs to the year-week calculated befor
    acc[yearDay].push(cur);

    return acc;
  }, {});

  // Final result that match with transaction-slice
  Object.keys(groupByDay).forEach(key => {
    const dayInYear = key.split('-');

    results[+dayInYear[1] - 1] = {
      id: 'transId' + `${groupByDay[key][0].day}`,
      date: groupByDay[key][0].date,
      day: groupByDay[key][0].day,
      expense_daily: +groupByDay[key][1].amount,
      income_daily: +groupByDay[key][0].amount,
      // };
    };
  });

  const resultFiltered = results?.filter(result => result !== undefined);

  return resultFiltered;
}

import moment from 'moment';

export function getFormattedDate(date) {
  return date.toISOString().slice(0, 10);
  // return date.slice(0, 10);
}

export function getDateMinusDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
  // return moment().subtract(date, days);
}

// a and b are javascript Date objects
export function dateDiffInDays(endDate: Date, startDate: Date) {
  const st_date = moment(startDate);
  const end_date = moment(endDate);

  const duration = st_date.diff(end_date, 'days');

  return duration;
}

// WEEK of Month
export function getWeekInMonth(year, month, day) {
  let weekNum = 1; // we start at week 1

  let weekDay = new Date(year, month, 1).getDay(); // we get the weekDay of day 1
  weekDay = weekDay === 0 ? 6 : weekDay - 1; // we recalculate the weekDay (Mon:0, Tue:1, Wed:2, Thu:3, Fri:4, Sat:5, Sun:6)

  let monday = 1 + (7 - weekDay); // we get the first monday of the month

  while (monday <= day) {
    //we calculate in wich week is our day
    weekNum++;
    monday += 7;
  }

  return weekNum; //we return it
}

// GET Days in week of current date
export const getDaysInWeek = (
  year: string,
  month: string,
  daysInMonth: number,
) => {
  let w1 = [];
  let w2 = [];
  let w3 = [];
  let w4 = [];
  let w5 = [];

  if (+month < 10) {
    month = `0${month}`;
  }

  let weeks;
  for (i = 1; i <= daysInMonth; i++) {
    const date = moment(`${year}-${month}-0${i}`);
    weeks = getWeekInMonth(year, month, moment(date).date());

    if (weeks === 1) {
      w1.push(date);
    }
    if (weeks === 2) {
      w2.push(date);
    }
    if (weeks === 3) {
      w3.push(date);
    }
    if (weeks === 4) {
      w4.push(date);
    }
    if (weeks === 5) {
      w5.push(date);
    }
  }

  return [
    {
      w1: w1,
      w2: w2,
      w3: w3,
      w4: w4,
      w5: w5,
    },
  ];
};

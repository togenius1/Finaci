import React from 'react';
// import {TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {icon} from './icon';
import {GlobalStyles} from './styles';

export const Category = [
  {
    label: 'Food',
    value: 'food',
    icon: () => (
      <Ionicons
        name={icon.iconName.food}
        color={GlobalStyles.colors.food}
        size={20}
      />
    ),
  },
  {
    label: 'Beverage',
    value: 'beverage',
    icon: () => (
      <Ionicons
        name={icon.iconName.beverage}
        color={GlobalStyles.colors.beverage}
        size={20}
      />
    ),
  },
  {
    label: 'Travel',
    value: 'travel',
    icon: () => (
      <Ionicons
        name={icon.iconName.travel}
        color={GlobalStyles.colors.travel}
        size={20}
      />
    ),
  },
  {
    label: 'Others',
    value: 'others',
    icon: () => (
      <Ionicons name={icon.iconName.others} color="#8F80F3" size={20} />
    ),
  },
];

export function chartData(
  expensesOthersSum,
  expensesTravelSum,
  expensesBeverageSum,
  expensesFoodSum,
  maxExpenses,
  expensesSum,
) {
  const pieData = [
    {
      value: (expensesOthersSum * 100) / expensesSum,
      color: '#BDB2FA',
      gradientCenterColor: '#8F80F3',
      focused: maxExpenses === expensesOthersSum ? true : false,
    },
    {
      value: (expensesTravelSum * 100) / expensesSum,
      color: '#f76f8f',
      gradientCenterColor: '#f76386',
      focused: maxExpenses === expensesTravelSum ? true : false,
    },
    {
      value: (expensesBeverageSum * 100) / expensesSum,
      color: '#009FFF',
      gradientCenterColor: '#006DFF',
      focused: maxExpenses === expensesBeverageSum ? true : false,
    },
    {
      value: (expensesFoodSum * 100) / expensesSum,
      color: '#d47d26',
      gradientCenterColor: '#964B00',
      focused: maxExpenses === expensesFoodSum ? true : false,
    },
  ];

  return pieData;
}

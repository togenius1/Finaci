import Expense from '../models/expense';
import Income from '../models/income';

export const INCOME = [
  new Income(
    'i1',
    'ic1',
    'acc1',
    '20000',
    'Sell books',
    new Date('2022-10-24'),
  ),
  new Income(
    'i2',
    'ic2',
    'cash1',
    '10000',
    'special salary',
    new Date('2022-10-25'),
  ),
  new Income('i3', 'ic3', 'acc4', '2000', 'Sell shoes', new Date('2022-08-26')),
  new Income(
    'i4',
    'ic4',
    'acc3',
    '4500',
    'Office bonus',
    new Date('2022-10-27'),
  ),
  new Income(
    'i4',
    'ic4',
    'acc3',
    '2000',
    'Office bonus',
    new Date('2022-10-27'),
  ),
  new Income(
    'i5',
    'ic4',
    'acc4',
    '4000',
    'Sell laptop',
    new Date('2022-11-01'),
  ),
  new Income(
    'i5',
    'ic4',
    'acc4',
    '2500',
    'Sell laptop',
    new Date('2022-11-01'),
  ),
  new Income(
    'i5',
    'ic3',
    'acc5',
    '2000',
    'Sell laptop',
    new Date('2022-11-02'),
  ),
  new Income(
    'i5',
    'ic1',
    'cash1',
    '15000',
    'Sell laptop',
    new Date('2022-11-03'),
  ),
  new Income(
    'i5',
    'ic1',
    'cash1',
    '9500',
    'Sell laptop',
    new Date('2022-11-05'),
  ),
  new Income(
    'i5',
    'ic1',
    'cash1',
    '6500',
    'Sell laptop',
    new Date('2022-11-05'),
  ),
  new Income(
    'i5',
    'ic1',
    'cash1',
    '200',
    'Sell laptop',
    new Date('2022-11-05'),
  ),
  new Income(
    'i5',
    'ic1',
    'cash1',
    '1100',
    'Sell laptop',
    new Date('2022-11-05'),
  ),
  new Income(
    'i5',
    'ic1',
    'cash1',
    '1300',
    'Sell laptop',
    new Date('2022-11-08'),
  ),
  new Income(
    'i5',
    'ic1',
    'cash1',
    '2500',
    'Sell laptop',
    new Date('2022-11-09'),
  ),
  new Income(
    'i5',
    'ic1',
    'cash1',
    '2500',
    'Sell laptop',
    new Date('2022-11-10'),
  ),
  new Income(
    'i5',
    'ic1',
    'cash1',
    '500',
    'Sell laptop',
    new Date('2022-11-10'),
  ),
  new Income(
    'i5',
    'ic1',
    'cash1',
    '1000',
    'Sell laptop',
    new Date('2022-11-11'),
  ),
];

export const EXPENSES = [
  new Expense(
    'e1',
    'ec2',
    'cash1',
    '50.9',
    'pay electricity',
    new Date('2022-10-11'),
  ),
  new Expense(
    'e2',
    'ec2',
    'acc2',
    '77.5',
    'water of room rental',
    new Date('2022-10-12'),
  ),
  new Expense(
    'e3',
    'ec2',
    'acc2',
    '251.0',
    'fuel at Chicago and newYork',
    new Date('2022-10-13'),
  ),
  new Expense(
    'e4',
    'ec2',
    'cash1',
    '126.5',
    'changed car tires',
    new Date('2022-10-14'),
  ),
  new Expense(
    'e5',
    'ec2',
    'acc3',
    '123.5',
    'buy books at Amazon',
    new Date('2022-10-15'),
  ),

  new Expense(
    'e6',
    'ec2',
    'cash1',
    '117.66',
    'water of room rental',
    new Date('2022-10-16'),
  ),
  new Expense(
    'e7',
    'ec1',
    'acc2',
    '365',
    'fuel at Chicago',
    new Date('2022-10-17'),
  ),
  new Expense(
    'e8',
    'ec3',
    'cash1',
    '146.5',
    'changed car tires ',
    new Date('2022-10-18'),
  ),
  new Expense(
    'e9',
    'ec4',
    'acc3',
    '63.5',
    'buy books at Amazon',
    new Date('2022-10-19'),
  ),
  new Expense(
    'e10',
    'ec4',
    'acc3',
    '183.5',
    'buy books at Amazon',
    new Date('2022-10-20'),
  ),
  new Expense(
    'e11',
    'ec3',
    'acc3',
    '93.5',
    'buy books at Amazon',
    new Date('2022-10-21'),
  ),
  new Expense(
    'e12',
    'ec2',
    'acc4',
    '18.5',
    'buy books at Amazon',
    new Date('2022-10-22'),
  ),
  new Expense(
    'e13',
    'ec3',
    'cash1',
    '183.5',
    'buy books at Amazon',
    new Date('2022-10-23'),
  ),
  new Expense(
    'e14',
    'ec1',
    'acc3',
    '277.5',
    'buy books at Amazon',
    new Date('2022-10-24'),
  ),
  new Expense(
    'e15',
    'ec4',
    'acc3',
    '56.5',
    'buy books at Amazon',
    new Date('2022-10-25'),
  ),
  new Expense(
    'e16',
    'ec1',
    'acc3',
    '103.5',
    'buy books at Amazon',
    new Date('2022-10-26'),
  ),
  new Expense(
    'e17',
    'ec4',
    'acc3',
    '195.5',
    'buy books at Amazon',
    new Date('2022-10-27'),
  ),
  new Expense(
    'e18',
    'ec3',
    'acc3',
    '97.5',
    'buy books at Amazon',
    new Date('2022-10-28'),
  ),
  new Expense(
    'e19',
    'ec2',
    'acc3',
    '117.5',
    'buy books at Amazon',
    new Date('2022-10-29'),
  ),
  new Expense(
    'e20',
    'ec1',
    'acc3',
    '217.5',
    'buy books at Amazon',
    new Date('2022-10-30'),
  ),
  new Expense(
    'e20',
    'ec1',
    'acc3',
    '217.5',
    'buy books at Amazon',
    new Date('2022-10-31'),
  ),
  new Expense(
    'e21',
    'ec2',
    'acc1',
    '227.5',
    'buy books at Amazon',
    new Date('2022-11-01'),
  ),
  new Expense(
    'e22',
    'ec1',
    'acc1',
    '380.5',
    'Dinner with friends at restaurants',
    new Date('2022-11-02'),
  ),
  new Expense(
    'e23',
    'ec1',
    'acc5',
    '118.7',
    'Starbucks at office',
    new Date('2022-11-03'),
  ),
  new Expense(
    'e24',
    'ec2',
    'acc3',
    '269',
    'Starbucks at office',
    new Date('2022-11-04'),
  ),
  new Expense(
    'e24',
    'ec2',
    'acc3',
    '309',
    'Starbucks at office',
    new Date('2022-11-04'),
  ),
  new Expense(
    'e24',
    'ec1',
    'acc3',
    '209.7',
    'Starbucks at office',
    new Date('2022-11-05'),
  ),
  new Expense(
    'e24',
    'ec2',
    'acc3',
    '59.7',
    'Starbucks at office',
    new Date('2022-11-06'),
  ),
  new Expense(
    'e24',
    'ec3',
    'acc3',
    '99.7',
    'Starbucks at office',
    new Date('2022-11-08'),
  ),
  new Expense(
    'e24',
    'ec2',
    'acc3',
    '109.7',
    'Starbucks at office',
    new Date('2022-11-09'),
  ),
  new Expense(
    'e24',
    'ec1',
    'acc3',
    '200',
    'Starbucks at office',
    new Date('2022-11-11'),
  ),
];

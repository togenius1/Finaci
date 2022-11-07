// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { BackupKey, Expense, ExpenseCategory, AccountCategory, Income, IncomeCategory, CashCategory } = initSchema(schema);

export {
  BackupKey,
  Expense,
  ExpenseCategory,
  AccountCategory,
  Income,
  IncomeCategory,
  CashCategory
};
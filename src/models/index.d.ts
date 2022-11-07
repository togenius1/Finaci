import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem } from "@aws-amplify/datastore";

type BackupKeyMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ExpenseMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ExpenseCategoryMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type AccountCategoryMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type IncomeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type IncomeCategoryMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CashCategoryMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerBackupKey = {
  readonly id: string;
  readonly key?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBackupKey = {
  readonly id: string;
  readonly key?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type BackupKey = LazyLoading extends LazyLoadingDisabled ? EagerBackupKey : LazyBackupKey

export declare const BackupKey: (new (init: ModelInit<BackupKey, BackupKeyMetaData>) => BackupKey) & {
  copyOf(source: BackupKey, mutator: (draft: MutableModel<BackupKey, BackupKeyMetaData>) => MutableModel<BackupKey, BackupKeyMetaData> | void): BackupKey;
}

type EagerExpense = {
  readonly id: string;
  readonly cateId?: string | null;
  readonly accountId?: string | null;
  readonly amount?: number | null;
  readonly note?: string | null;
  readonly date?: string | null;
  readonly ExpenseCategory?: ExpenseCategory | null;
  readonly AccountCategory?: AccountCategory | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly expenseExpenseCategoryId?: string | null;
  readonly expenseAccountCategoryId?: string | null;
}

type LazyExpense = {
  readonly id: string;
  readonly cateId?: string | null;
  readonly accountId?: string | null;
  readonly amount?: number | null;
  readonly note?: string | null;
  readonly date?: string | null;
  readonly ExpenseCategory: AsyncItem<ExpenseCategory | undefined>;
  readonly AccountCategory: AsyncItem<AccountCategory | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly expenseExpenseCategoryId?: string | null;
  readonly expenseAccountCategoryId?: string | null;
}

export declare type Expense = LazyLoading extends LazyLoadingDisabled ? EagerExpense : LazyExpense

export declare const Expense: (new (init: ModelInit<Expense, ExpenseMetaData>) => Expense) & {
  copyOf(source: Expense, mutator: (draft: MutableModel<Expense, ExpenseMetaData>) => MutableModel<Expense, ExpenseMetaData> | void): Expense;
}

type EagerExpenseCategory = {
  readonly id: string;
  readonly title?: string | null;
  readonly date?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyExpenseCategory = {
  readonly id: string;
  readonly title?: string | null;
  readonly date?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ExpenseCategory = LazyLoading extends LazyLoadingDisabled ? EagerExpenseCategory : LazyExpenseCategory

export declare const ExpenseCategory: (new (init: ModelInit<ExpenseCategory, ExpenseCategoryMetaData>) => ExpenseCategory) & {
  copyOf(source: ExpenseCategory, mutator: (draft: MutableModel<ExpenseCategory, ExpenseCategoryMetaData>) => MutableModel<ExpenseCategory, ExpenseCategoryMetaData> | void): ExpenseCategory;
}

type EagerAccountCategory = {
  readonly id: string;
  readonly title?: string | null;
  readonly budget?: number | null;
  readonly date?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAccountCategory = {
  readonly id: string;
  readonly title?: string | null;
  readonly budget?: number | null;
  readonly date?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type AccountCategory = LazyLoading extends LazyLoadingDisabled ? EagerAccountCategory : LazyAccountCategory

export declare const AccountCategory: (new (init: ModelInit<AccountCategory, AccountCategoryMetaData>) => AccountCategory) & {
  copyOf(source: AccountCategory, mutator: (draft: MutableModel<AccountCategory, AccountCategoryMetaData>) => MutableModel<AccountCategory, AccountCategoryMetaData> | void): AccountCategory;
}

type EagerIncome = {
  readonly id: string;
  readonly cateId?: string | null;
  readonly accountId?: string | null;
  readonly amount?: number | null;
  readonly note?: string | null;
  readonly date?: string | null;
  readonly IncomeCategory?: IncomeCategory | null;
  readonly AccountCategory?: AccountCategory | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly incomeIncomeCategoryId?: string | null;
  readonly incomeAccountCategoryId?: string | null;
}

type LazyIncome = {
  readonly id: string;
  readonly cateId?: string | null;
  readonly accountId?: string | null;
  readonly amount?: number | null;
  readonly note?: string | null;
  readonly date?: string | null;
  readonly IncomeCategory: AsyncItem<IncomeCategory | undefined>;
  readonly AccountCategory: AsyncItem<AccountCategory | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly incomeIncomeCategoryId?: string | null;
  readonly incomeAccountCategoryId?: string | null;
}

export declare type Income = LazyLoading extends LazyLoadingDisabled ? EagerIncome : LazyIncome

export declare const Income: (new (init: ModelInit<Income, IncomeMetaData>) => Income) & {
  copyOf(source: Income, mutator: (draft: MutableModel<Income, IncomeMetaData>) => MutableModel<Income, IncomeMetaData> | void): Income;
}

type EagerIncomeCategory = {
  readonly id: string;
  readonly title?: string | null;
  readonly date?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyIncomeCategory = {
  readonly id: string;
  readonly title?: string | null;
  readonly date?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type IncomeCategory = LazyLoading extends LazyLoadingDisabled ? EagerIncomeCategory : LazyIncomeCategory

export declare const IncomeCategory: (new (init: ModelInit<IncomeCategory, IncomeCategoryMetaData>) => IncomeCategory) & {
  copyOf(source: IncomeCategory, mutator: (draft: MutableModel<IncomeCategory, IncomeCategoryMetaData>) => MutableModel<IncomeCategory, IncomeCategoryMetaData> | void): IncomeCategory;
}

type EagerCashCategory = {
  readonly id: string;
  readonly title?: string | null;
  readonly budget?: number | null;
  readonly date?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCashCategory = {
  readonly id: string;
  readonly title?: string | null;
  readonly budget?: number | null;
  readonly date?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CashCategory = LazyLoading extends LazyLoadingDisabled ? EagerCashCategory : LazyCashCategory

export declare const CashCategory: (new (init: ModelInit<CashCategory, CashCategoryMetaData>) => CashCategory) & {
  copyOf(source: CashCategory, mutator: (draft: MutableModel<CashCategory, CashCategoryMetaData>) => MutableModel<CashCategory, CashCategoryMetaData> | void): CashCategory;
}
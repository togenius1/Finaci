import {RouteProp} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

// export type ExpensesModel = {
//   id: string | null;
//   budget: number;
//   category: string | null;
//   description: string | null;
//   amount: number;
//   date: Date;
// };

export type RootStackParamList = {
  Overview: undefined;
  Expenses: undefined;
  AllExpenses: undefined;
  ExpenseGraphs: undefined;
  Menu: undefined;
  // Analysis: undefined;
  AddExpenses: {
    amount: string;
  };
  AddDetails: {
    amount: string;
    category?: string;
    account?: string;
  };
  Category: {
    category: string | null;
  };
  Note: {
    note: string;
  };
  Account: {
    account: string;
  };
  ManageExpenses: undefined;
  Settings: undefined;
};

//------------------------------------------------------------------------
//---------------------------Screen Type------------------------------------
export type OverviewPropsType = NativeStackScreenProps<
  RootStackParamList,
  'Overview'
>;

export type ManageExpensesPropsType = NativeStackScreenProps<
  RootStackParamList,
  'ManageExpenses'
>;

//------------------------------------------------------------------------
//---------------------------Navigation Type---------------------------------
export type OverviewNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Overview'
>;

export type ManageExpensesNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ManageExpenses'
>;

export type CategoryNavigationType = NativeStackNavigationProp<
  RootStackParamList,
  'Category'
>;

export type NoteNavigationType = NativeStackNavigationProp<
  RootStackParamList,
  'Note'
>;

export type AccountNavigationType = NativeStackNavigationProp<
  RootStackParamList,
  'Account'
>;

//------------------------------------------------------------------------
//---------------------------Route Type------------------------------------
export type ManageExpensesRouteProp = RouteProp<
  RootStackParamList,
  'ManageExpenses'
>;

export type AddDetailsRouteProp = RouteProp<RootStackParamList, 'AddDetails'>;

export type AddExpensesRouteProp = RouteProp<RootStackParamList, 'AddExpenses'>;

export type NoteRouteProp = RouteProp<RootStackParamList, 'Note'>;

export type AccountRouteProp = RouteProp<RootStackParamList, 'Account'>;

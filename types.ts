import {RouteProp} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  // NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Overview: undefined;
  Transaction: undefined;
  Stats: undefined;
  Menu: undefined;
  ExpenseGraphs: undefined;
  Accounts: {
    account: string;
  };
  AccountsItem: undefined;
  AddExpenses: {
    amount: string;
  };
  Settings: undefined;
  AddDetails: {
    amount: string;
    category?: string;
    account?: string;
  };
};

//------------------------------------------------------------------------
//---------------------------Screen Type------------------------------------
// export type OverviewPropsType = NativeStackScreenProps<
//   RootStackParamList,
//   'Overview'
// >;

//------------------------------------------------------------------------
//---------------------------Navigation Type---------------------------------
export type OverviewNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Overview'
>;

export type TransactionNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Transaction'
>;

export type StatsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Stats'
>;

export type AccountsItemNavigationType = NativeStackNavigationProp<
  RootStackParamList,
  'AccountsItem'
>;

export type SettingsItemNavigationType = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

export type AddDetailsNavigationType = NativeStackNavigationProp<
  RootStackParamList,
  'AddDetails'
>;

export type AccountNavigationType = NativeStackNavigationProp<
  RootStackParamList,
  'Accounts'
>;

//------------------------------------------------------------------------
//---------------------------Route Type------------------------------------

export type AddDetailsRouteProp = RouteProp<RootStackParamList, 'AddDetails'>;

export type AddExpensesRouteProp = RouteProp<RootStackParamList, 'AddExpenses'>;

export type StatsRouteProp = RouteProp<RootStackParamList, 'Stats'>;

export type AccountsRouteProp = RouteProp<RootStackParamList, 'Accounts'>;
export type AccountsItemRouteProp = RouteProp<
  RootStackParamList,
  'AccountsItem'
>;

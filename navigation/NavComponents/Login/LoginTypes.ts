import {RouteProp} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type RootStackParamListLogin = {
  Home: undefined;
  ForgotPassword: undefined;
  ConfirmEmail: undefined;
  NewPassword: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

//------------------------------------------------------------------------
//---------------------------Screen Type------------------------------------
export type HomePropsType = NativeStackScreenProps<
  RootStackParamListLogin,
  'Home'
>;

export type ForgotPasswordPropsType = NativeStackScreenProps<
  RootStackParamListLogin,
  'ForgotPassword'
>;

export type ConfirmEmailPropsType = NativeStackScreenProps<
  RootStackParamListLogin,
  'ConfirmEmail'
>;

export type NewPasswordPropsType = NativeStackScreenProps<
  RootStackParamListLogin,
  'NewPassword'
>;

export type SignInPropsType = NativeStackScreenProps<
  RootStackParamListLogin,
  'SignIn'
>;

export type SignUpPropsType = NativeStackScreenProps<
  RootStackParamListLogin,
  'SignUp'
>;

//------------------------------------------------------------------------
//---------------------------Navigation Type---------------------------------
export type OverviewNavigationProp = NativeStackNavigationProp<
  RootStackParamListLogin,
  'ConfirmEmail'
>;

//------------------------------------------------------------------------
//---------------------------Route Type------------------------------------
// export type ManageExpensesRouteProp = RouteProp<
//   RootStackParamList,
//   'ManageExpenses'
// >;

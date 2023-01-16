import {StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {v4 as uuidv4} from 'uuid';

import {AccountNavigationType} from '../../types';
import {useAppSelector} from '../../hooks';
// import {fetchCashAccountsData} from '../../store/cash-action';
// import {fetchAccountsData} from '../../store/account-action';
import {sumTotalBudget, sumTotalFunc} from '../../util/math';
import AddAccountForm from '../Form/AddAccountForm';
import AccountElement from './AccountElement';
// import {fetchExpensesData} from '../../store/expense-action';

// import {EXPENSES} from '../dummy/dummy';

type Props = {
  navigation: AccountNavigationType;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
};

// const {width, height} = Dimensions.get('window');

const AccountComponents = ({
  isModalVisible,
  setIsModalVisible,
  // onNavigate,
  navigation,
}: Props) => {
  // const dispatch = useAppDispatch();
  const expenseData = useAppSelector(
    state => state.expenses.expenses,
    // shallowEqual,
  );
  const cashData = useAppSelector(
    state => state.cashAccounts.cashAccounts,
    // shallowEqual,
  );
  const accountsData = useAppSelector(
    state => state.accounts.accounts,
    // shallowEqual,
  );

  // const [expenseData, setExpenseData] = useState<ExpenseType>();
  // const [cashData, setCashData] = useState<CashType>();
  // const [accountsData, setAccountsData] = useState<AccountType>();
  // const [addAccountPressed, setAddAccountPressed] = useState<boolean>(false);
  const [accountText, setAccountText] = useState<string | null>('');
  // const [removeAccount, setRemoveAccount] = useState<boolean>(false);
  const [isEditAccount, setIsEditAccount] = useState<boolean>(false);
  // const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // const [editedAccountId, setEditedAccountId] = useState<string | null>();
  const [cashBudget, setCashBudget] = useState<number | undefined>();
  const [accountsBudget, setAccountsBudget] = useState<number | undefined>();
  const [totalExpenses, setTotalExpenses] = useState<number | undefined>();
  const [addAccPressed, setAddAccPressed] = useState<boolean>(false);
  const [budget, setBudget] = useState<number | undefined>();

  useEffect(() => {
    const cashBudget = sumTotalBudget(cashData);
    const accountsBudget = sumTotalBudget(accountsData);
    const totalExpenses = sumTotalFunc(expenseData);

    setCashBudget(cashBudget);
    setAccountsBudget(accountsBudget);
    setTotalExpenses(totalExpenses);
  }, [totalExpenses, accountsBudget, cashBudget]);

  if (
    cashData === undefined ||
    accountsData === undefined ||
    expenseData === undefined
  ) {
    return;
  }

  function onNavigate(item) {
    // console.log(item);
    navigation.navigate('AccountsItem', {
      account: item.title,
      accountId: item.id,
    });
  }

  // Sort Data
  const getSortedState = data =>
    [...data]?.sort((a, b) => parseInt(b.budget) - parseInt(a.budget));
  const sortedItems = useMemo(() => {
    if (accountsData) {
      return getSortedState(accountsData);
    }
    return accountsData;
  }, [accountsData]);

  return (
    <>
      <View style={styles.container}>
        <AccountElement
          setIsModalVisible={setIsModalVisible}
          setAccountText={setAccountText}
          setAddAccPressed={setAddAccPressed}
          accountText={accountText}
          addAccPressed={addAccPressed}
          setBudget={setBudget}
          setIsEditAccount={setIsEditAccount}
          cashData={cashData}
          accountsData={accountsData}
          sortedItems={sortedItems}
          cashBudget={cashBudget}
          accountsBudget={accountsBudget}
          totalExpenses={totalExpenses}
          onPress={onNavigate}
        />

        <AddAccountForm
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
          setAccountText={setAccountText}
          accountText={accountText}
          addAccPressed={addAccPressed}
          setAddAccPressed={setAddAccPressed}
          budget={budget}
          setBudget={setBudget}
          isEditAccount={isEditAccount}
          setIsEditAccount={setIsEditAccount}
        />
      </View>
    </>
  );
};

export default AccountComponents;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position: 'absolute',
    // backgroundColor: 'red',
  },
});

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
import moment from 'moment';
// import {fetchExpensesData} from '../../store/expense-action';

// import {EXPENSES} from '../dummy/dummy';

// const {width, height} = Dimensions.get('window');

const AccountComponents = ({
  isModalVisible,
  setIsModalVisible,
  navigation,
  month,
  year,
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
  0;
  const [accountText, setAccountText] = useState<string | null>('');
  const [isEditAccount, setIsEditAccount] = useState<boolean>(false);
  const [isEditCash, setIsEditCash] = useState<boolean>(false);
  const [cashBudget, setCashBudget] = useState<number | undefined>();
  const [accountsBudget, setAccountsBudget] = useState<number | undefined>();
  const [totalExpenses, setTotalExpenses] = useState<number | undefined>();
  const [addAccPressed, setAddAccPressed] = useState<boolean>(false);
  const [budget, setBudget] = useState<number | undefined>();
  const [lastEditedDate, setLastEditedDate] = useState<string>();

  useEffect(() => {
    const cashBudget = sumTotalBudget(cashData);
    const accountsBudget = sumTotalBudget(accountsData);
    const totalExpenses = sumTotalFunc(expenseData);

    setCashBudget(cashBudget);
    setAccountsBudget(accountsBudget);
    setTotalExpenses(totalExpenses);
  }, [totalExpenses, accountsBudget, cashBudget]);

  // Filtered Accounts data
  const filteredAccountsData = accountsData?.filter(
    account =>
      +moment(account?.date).month() + 1 === +month &&
      +moment(account?.date).year() === year,
  );

  // Filtered Cash data
  const filteredCashData = cashData?.filter(
    account =>
      +moment(account?.date).month() + 1 === +month &&
      +moment(account?.date).year() === year,
  );

  // Sort Data
  const getSortedState = data =>
    [...data]?.sort((a, b) => parseInt(b.budget) - parseInt(a.budget));
  const sortedItems = useMemo(() => {
    if (filteredAccountsData) {
      return getSortedState(filteredAccountsData);
    }
    return filteredAccountsData;
  }, [filteredAccountsData]);

  // Navigation
  function onNavigate(item) {
    navigation.navigate('AccountsItem', {
      account: item.title,
      accountId: item.id,
      date: item.date,
    });
  }

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
          setIsEditCash={setIsEditCash}
          cashData={filteredCashData}
          accountsData={filteredAccountsData}
          sortedItems={sortedItems}
          cashBudget={cashBudget}
          accountsBudget={accountsBudget}
          totalExpenses={totalExpenses}
          onPress={onNavigate}
          setLastEditedDate={setLastEditedDate}
        />

        <View style={styles.form}>
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
            isEditCash={isEditCash}
            setIsEditCash={setIsEditCash}
            month={month}
            year={year}
            lastEditedDate={lastEditedDate}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position: 'absolute',
    // backgroundColor: 'red',
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AccountComponents;

// ============================ TYPE =====================================
type Props = {
  navigation: AccountNavigationType;
  isModalVisible: boolean;
  month: number;
  year: number;
  setIsModalVisible: (value: boolean) => void;
};

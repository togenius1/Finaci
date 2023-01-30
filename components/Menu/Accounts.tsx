import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';

import AddAccountForm from '../Form/AddAccountForm';
import {useAppSelector} from '../../hooks';

// import {AccountType} from '../../models/account';
import {currencyFormatter} from '../../util/currencyFormatter';
import {sumTotalBudget, sumTotalFunc} from '../../util/math';
import AccountHeader from '../AccountHeader';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

type Props = {
  // navigation: AccountNavigationType;
  setAccountPressed: Dispatcher<boolean>;
  month: number;
  year: number;
};

const {width, height} = Dimensions.get('window');

const Accounts = ({setAccount, setAccountPressed, month, year}: Props) => {
  // const navigation = useNavigation();
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

  // Filter Accounts and Cash with month and year
  const filteredAccounts = accountsData?.filter(
    account =>
      +moment(account.date).month() === month &&
      +moment(account.date).year() === year,
  );
  const filteredCash = cashData?.filter(
    cash =>
      +moment(cash.date).month() === month &&
      +moment(cash.date).year() === year,
  );

  const [accountText, setAccountText] = useState<string | null>('');
  const [isEditAccount, setIsEditAccount] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [cashBudget, setCashBudget] = useState<number | undefined>();
  const [accountsBudget, setAccountsBudget] = useState<number | undefined>();
  const [totalExpenses, setTotalExpenses] = useState<number | undefined>();
  const [addAccPressed, setAddAccPressed] = useState<boolean>(false);
  const [budget, setBudget] = useState<number | undefined>();

  useEffect(() => {
    const cashBudget = sumTotalBudget(filteredCash);
    const accountsBudget = sumTotalBudget(filteredAccounts);
    const totalExpenses = sumTotalFunc(expenseData);

    setCashBudget(cashBudget);
    setAccountsBudget(accountsBudget);
    setTotalExpenses(totalExpenses);
  }, [expenseData, filteredAccounts, filteredCash]);

  // Total expenses
  const totalAssets = Number(cashBudget) + Number(accountsBudget);
  const total = totalAssets - +totalExpenses;

  // Sort Data
  const getSortedState = data =>
    [...data]?.sort((a, b) => parseInt(b.budget) - parseInt(a.budget));
  const sortedItems = useMemo(() => {
    if (filteredAccounts) {
      return getSortedState(filteredAccounts);
    }
    return filteredAccounts;
  }, [filteredAccounts]);

  // Set account
  function onAccountsHandler(item) {
    // console.log('item: ', item);
    setAccountPressed(false);
    setAccount(item === undefined ? null : item);
  }

  const renderItem = ({item}) => {
    const budgeted = currencyFormatter(+item.budget, {});

    if (item?.budget === 0) return;
    return (
      <View>
        <Pressable
          key={item}
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => onAccountsHandler(item)}>
          <View style={styles.item}>
            <Text>{item.title}</Text>
            <Text>{budgeted}</Text>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => {
          setAccountPressed(false);
        }}>
        <View style={{alignItems: 'flex-end', marginRight: 10, marginTop: 10}}>
          <Ionicons name="close" size={24} color="black" />
        </View>
      </Pressable>

      <AccountHeader
        totalAssets={totalAssets}
        totalExpenses={totalExpenses}
        total={total}
      />

      <View style={{marginTop: 20}}>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => onAccountsHandler(filteredCash[0])}>
          <View style={styles.item}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Cash</Text>
            <Text>{currencyFormatter(cashBudget, {})}</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.accountsContainer}>
        <View style={styles.cash}>
          <Text style={styles.accountTitle}>Accounts</Text>
          <FlatList
            keyExtractor={item => item.title + uuidv4()}
            data={sortedItems}
            renderItem={renderItem}
            bounces={false}
          />
        </View>
      </View>

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
  );
};

export default Accounts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.95,
    height: height * 0.84,
    position: 'absolute',
    top: 10,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: 'white',
  },
  assetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderColor: 'lightgrey',
    borderWidth: 0.5,
  },
  accountsContainer: {
    flex: 1,
    marginTop: 20,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#444343',
  },
  cash: {
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: width * 0.8,
    top: 60,
    marginBottom: 70,
    marginLeft: 20,
    // backgroundColor: 'red',
  },
  pressed: {
    opacity: 0.65,
  },
});

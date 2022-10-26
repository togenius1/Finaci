import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {v4 as uuidv4} from 'uuid';

import {EXPENSES} from '../dummy/dummy';
import {AccountCategory, CashCategory} from '../dummy/categoryItems';
import Input from '../components/ManageExpense/Input';
import Button from '../components/UI/Button';
import {useAppDispatch} from '../hooks';
import {accountActions} from '../store/account-slice';
import {sumTotalBudget, sumTotalFunc} from '../util/math';

type Props = {};

const {width, height} = Dimensions.get('window');

const colors = {
  cash: 'blue',
  account: 'red',
};
//
const AddAccountForm = ({
  closeFormHandler,
  saveFormHandler,
  setAccountText,
  account,
  setBudget,
  budget,
}) => {
  return (
    <View style={styles.addAccountForm}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => closeFormHandler()}>
        <View
          style={{
            position: 'absolute',
            right: -140,
            // top: 5,
          }}>
          <Ionicons name="close" size={20} color="#000000" />
        </View>
      </Pressable>
      <Input
        label={'Account'}
        style={styles.input}
        textInputConfig={{
          onChangeText: setAccountText,
          value: account,
          placeholder: 'account name',
        }}
      />
      <Input
        label={'Budget'}
        style={styles.input}
        textInputConfig={{
          keyboardType: 'numeric',
          onChangeText: setBudget,
          value: budget,
          placeholder: 'budget amount',
        }}
      />
      <Button
        style={{width: 60}}
        styleBtn={{paddingVertical: 6, backgroundColor: '#4e9ff1'}}
        onPress={() => saveFormHandler()}>
        Save
      </Button>
    </View>
  );
};

const AccountsScreen = ({navigation, setAccount, setAccountPressed}: Props) => {
  const [accountData, setAccountData] = useState();
  const [cashData, setCashData] = useState();
  const [expenseData, setExpenseData] = useState();
  const [addAccountPressed, setAddAccountPressed] = useState<boolean>(false);
  const [account, setAccountText] = useState<string>('');
  const [budget, setBudget] = useState<number>(0);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setAccountData(AccountCategory);
    setCashData(CashCategory);
    setExpenseData(EXPENSES);
  }, []);

  if (
    accountData === null ||
    accountData === undefined ||
    expenseData === null ||
    expenseData === undefined ||
    cashData === null ||
    cashData === undefined
  ) {
    return <ActivityIndicator />;
  }
  const cashBudget = sumTotalBudget(cashData)?.toFixed(2);
  const accountsBudget = sumTotalBudget(accountData)?.toFixed(2);
  const totalAssets = +cashBudget + +accountsBudget;
  const totalExpenses = sumTotalFunc(expenseData)?.toFixed(2);
  const total = totalAssets - +totalExpenses;

  function onAccountsHandler(item) {
    navigation.navigate('AccountsItem', {
      account: item.title,
      accountId: item.id,
    });
  }

  function addAccountHandler() {
    setAddAccountPressed(pressed => !pressed);
  }

  function closeFormHandler() {
    setAddAccountPressed(false);
  }

  function saveFormHandler() {
    dispatch(
      accountActions.addAccount({
        id: 'account' + uuidv4(),
        account: account,
        budget: budget,
        date: new Date(),
      }),
    );
    setAddAccountPressed(false);
  }

  const renderItem = ({item}) => {
    const accBalance = total - +item.budget;

    return (
      <View>
        <Pressable
          key={item}
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => onAccountsHandler(item)}>
          <View style={styles.item}>
            <View>
              <Text style={{fontSize: 16}}>{item.title}</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'blue'}}>
                {accBalance.toFixed(2)}
              </Text>
              <Text style={{fontSize: 11, marginTop: 10}}>
                ({item.budget} budget)
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.assetsContainer}>
        <View>
          <Text>Assets</Text>
          <Text style={{color: 'blue'}}>{totalAssets}</Text>
        </View>
        <View>
          <Text>Liabilities</Text>
          <Text style={{color: 'red'}}>{totalExpenses}</Text>
        </View>
        <View>
          <Text>Total</Text>
          <Text>{total}</Text>
        </View>
      </View>
      <View style={styles.accountsContainer}>
        <View style={styles.cash}>
          <Text style={styles.accountTitle}>Cash</Text>
          <FlatList
            keyExtractor={item => item.id + uuidv4()}
            data={cashData}
            renderItem={renderItem}
            bounces={false}
          />
        </View>
        <View style={styles.accountsContainer}>
          <Text style={styles.accountTitle}>Accounts</Text>
          <FlatList
            keyExtractor={item => item.id + uuidv4()}
            data={accountData}
            renderItem={renderItem}
            bounces={false}
          />
        </View>
      </View>
      <View style={styles.addButton}>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => addAccountHandler()}>
          <View style={{marginRight: 10, marginBottom: 15}}>
            <Ionicons name="add-circle" size={45} color="#3683e2" />
          </View>
        </Pressable>
      </View>

      {addAccountPressed && (
        <AddAccountForm
          closeFormHandler={closeFormHandler}
          saveFormHandler={saveFormHandler}
          setAccountText={setAccountText}
          account={account}
          setBudget={setBudget}
          budget={budget}
        />
      )}
    </View>
  );
};

export default AccountsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  assetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
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
  },
  accounts: {
    marginBottom: 50,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: width * 0.8,
    marginBottom: 30,
    marginLeft: 60,
    // backgroundColor: 'red',
  },
  addAccountForm: {
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    height: 200,
    borderWidth: 0.8,
    borderRadius: 5,
    borderColor: '#d4d4d4',
    backgroundColor: '#ffffff',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    position: 'absolute',
    bottom: 120,
    right: 55,
  },
  input: {
    width: width * 0.6,
    // height: 30,
    // marginLeft: 25,
  },
  pressed: {
    opacity: 0.65,
  },
});

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {v4 as uuidv4} from 'uuid';

import {AccountCategory} from '../../dummy/categoryItems';
import AddAccountForm from '../Form/AddAccountForm';
import {useAppDispatch} from '../../hooks';
import {accountActions} from '../../store/account-slice';

type Props = {
  setAccount: any;
  setAccountPressed: any;
};

const {width, height} = Dimensions.get('window');

// const colors = {
//   cash: 'blue',
//   account: 'red',
// };

const Account = ({setAccount, setAccountPressed}: Props) => {
  const [data, setDate] = useState();
  const [addAccountPressed, setAddAccountPressed] = useState<boolean>(false);
  const [account, setAccountText] = useState<string>('');
  const [budget, setBudget] = useState<number>(0);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setDate(AccountCategory);
  }, []);

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
    return (
      <View>
        <Pressable
          key={item}
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => onAccountsHandler(item)}>
          <View style={styles.item}>
            <Text>{item.title}</Text>
            <Text>27,000</Text>
          </View>
        </Pressable>
      </View>
    );
  };

  function onAccountsHandler(item) {
    setAccountPressed(false);
    setAccount(item);
  }

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
      <View style={styles.assetsContainer}>
        <View>
          <Text>Assets</Text>
          <Text style={{color: 'green'}}>$27,000</Text>
        </View>
        <View>
          <Text>Liabilities</Text>
          <Text style={{color: 'red'}}>$11,000</Text>
        </View>
        <View>
          <Text>Total</Text>
          <Text>$16,000</Text>
        </View>
      </View>
      <View style={styles.accountsContainer}>
        <View style={styles.cash}>
          <Text style={styles.accountTitle}>Accounts</Text>
          <FlatList
            keyExtractor={item => item.title + uuidv4()}
            data={data}
            renderItem={renderItem}
            bounces={false}
          />
        </View>
      </View>
      <View style={styles.addButton}>
        {/* <Text>Add Account</Text> */}
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => addAccountHandler()}>
          <View style={{marginRight: 10, marginBottom: 15}}>
            <Ionicons name="add-circle" size={45} color="#367ed5" />
          </View>
        </Pressable>
      </View>

      {addAccountPressed && (
        <View style={{left: 15, top: 40}}>
          <AddAccountForm
            closeFormHandler={closeFormHandler}
            saveFormHandler={saveFormHandler}
            setAccountText={setAccountText}
            account={account}
            setBudget={setBudget}
            budget={budget}
          />
        </View>
      )}
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.9,
    height: height * 0.65,
    position: 'absolute',
    top: 50,
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

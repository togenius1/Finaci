import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Input from '../ManageExpense/Input';
import Button from '../UI/CButton';
import {GlobalStyles} from '../../constants/styles';
import {useAppDispatch, useAppSelector} from '../../hooks';
import moment from 'moment';
import {accountActions} from '../../store/account-slice';
import {AccountType} from '../../models/account';
import {AccountCategory} from '../../dummy/account';
import {fetchCashAccountsData} from '../../store/cash-action';
import {fetchAccountsData} from '../../store/account-action';
import CButton from '../UI/CButton';

type Props = {
  editAccount: boolean;
  selectedCash: boolean;
  isModalVisible: boolean;
  accountText: string;
  budget: number;
  saveFormHandler: () => void;
};

const {width, height} = Dimensions.get('window');

const AddAccountForm = ({
  editAccount,
  selectedCash,
  accountText,
  budget,
  isModalVisible,
  setAccountText,
  setBudget,
  setIsModalVisible,
  setSelectedCash,
}: Props) => {
  //
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const [filterData, setFilterData] = useState<any[]>();
  const [addAccPressed, setAddAccPressed] = useState<boolean>(false);
  const [addBudgetPressed, setAddBudgetPressed] = useState<boolean>(false);
  const [itemPressed, setItemPressed] = useState<boolean>(false);
  // const [categoryText, setCategoryText] = useState<string | null>('');
  // const [addedAccount, setAddedAccount] = useState<boolean>(false);
  // const [accountsCatData, setAccountsCatData] = useState<AccountType>();

  const accountsData = dataLoaded?.accounts?.accounts;

  useEffect(() => {
    setFilterData(accountsData);
  }, [addAccPressed]);

  useEffect(() => {}, [addAccPressed]);

  function saveFormHandler() {
    if (selectedCash) {
      const cashId = 'cash-' + uuidv4();
      // Create new Cash Account
      if (cashData?.length === 0) {
        dispatch(
          cashAccountsActions.addCashAccount({
            id: cashId,
            budget: budget,
            date: new Date(),
          }),
        );
      } else {
        // Update Cash Account
        dispatch(
          cashAccountsActions.updateCashAccount({
            id: cashData[0]?.id,
            budget: +cashData[0]?.budget + +budget,
            date: new Date(),
          }),
        );
      }
    } else {
      //
      const accId = 'cash-' + uuidv4();
      const findAccTitle = accountsData?.findIndex(
        acc => acc?.title === accountText,
      );
      // dispatch account
      if (accountsData?.length === 0 || findAccTitle === -1) {
        dispatch(
          accountActions.addAccount({
            id: accId,
            title: accountText,
            budget: budget,
            date: new Date(),
            removable: true,
          }),
        );
      } else {
        Alert.alert('Account Warning', 'The account is in the list already.');
      }
    }
    // setAddAccountPressed(false);
  }

  const renderItem = ({item}) => {
    return (
      // <View>
      <Pressable
        key={item.title + uuidv4()}
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => categoryHandler(item)}>
        <View style={styles.item}>
          <Text>{item.title}</Text>
        </View>
      </Pressable>
      // </View>
    );
  };

  function categoryHandler(item) {
    setAccountText(item?.title);
    setAddAccPressed(true);
    setItemPressed(item => !item);
  }

  function searchFilterHandler(text) {
    if (text) {
      const newData = accountsData?.filter(item => {
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilterData(newData);
    } else {
      setFilterData(accountsData);
    }
  }

  const addAccount = () => {
    setAddAccPressed(true);
  };

  // const addBudgetHandler = () => {
  //   setAddBudgetPressed(true);
  //   setAddAccPressed(false);
  //   // setIsModalVisible(false);
  // };

  const closeHandler = () => {
    // Reset State
    setIsModalVisible(false);
    setAddBudgetPressed(false);
    setAddAccPressed(false);
  };

  const saveHandler = () => {
    console.log('saved');
    saveFormHandler();

    // Reset State
    setIsModalVisible(false);
    setAddBudgetPressed(false);
    setAddAccPressed(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onDismiss={() => setIsModalVisible(false)}
      onRequestClose={() => setIsModalVisible(false)}>
      <View style={styles.container}>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => closeHandler()}>
          <View
            style={{alignItems: 'flex-end', marginRight: 10, marginTop: 10}}>
            <Ionicons name="close" size={24} color="black" />
          </View>
        </Pressable>

        <View style={styles.accounts}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => console.log('Cash selected')}>
            <View style={styles.account}>
              <Text>Cash</Text>
            </View>
          </Pressable>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => console.log('Cash selected')}>
            <View style={styles.account}>
              <Text>Accounts</Text>
            </View>
          </Pressable>
        </View>

        <View style={{marginLeft: 20}}>
          <Text style={{fontWeight: '800', fontSize: height * 0.02}}>
            Search:
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="search or add category"
            onChange={event => {
              searchFilterHandler(event.nativeEvent.text);
            }}
            onChangeText={setAccountText}
            value={addAccPressed ? accountText : filterData}
          />
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => addAccount()}>
            <Text style={{fontWeight: '800', color: '#0439c2'}}>Add</Text>
          </Pressable>
        </View>

        {addAccPressed && (
          <>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Please Enter budget amount."
                keyboardType="numeric"
                // onChange={event => {
                //   searchFilterHandler(event.nativeEvent.text);
                // }}
                onChangeText={setBudget}
                value={budget}
              />
              {/* <Pressable
                style={({pressed}) => pressed && styles.pressed}
                onPress={() => addBudgetHandler()}>
                <Text style={{fontWeight: '800', color: '#0439c2'}}>Add</Text>
              </Pressable> */}
            </View>

            <Pressable
              style={({pressed}) => pressed && styles.pressed}
              onPress={() => saveHandler()}>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: width * 0.05,
                    fontWeight: '600',
                    color: 'blue',
                  }}>
                  Save
                </Text>
              </View>
            </Pressable>
          </>
        )}

        <FlatList
          keyExtractor={item => item.title + uuidv4()}
          data={filterData}
          renderItem={renderItem}
          bounces={false}
        />
      </View>
    </Modal>
  );
};

export default AddAccountForm;

const WIDTH = width * 0.9;

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: height * 0.75,
    marginHorizontal: 20,
    marginTop: 100,

    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor: 'white',
  },
  accounts: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  account: {
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 10,
    width: WIDTH / 2,
    borderColor: 'lightgrey',

    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 1,
  },
  searchContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
    flexDirection: 'row',
    // backgroundColor: '#facece',
  },
  textInput: {
    width: width * 0.55,
    height: height * 0.05,
    marginRight: 20,
    marginLeft: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
  },
  item: {
    padding: height * 0.012,
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  pressed: {
    opacity: 0.65,
  },
});

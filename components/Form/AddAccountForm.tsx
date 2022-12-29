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
import moment from 'moment';
import {GlobalStyles} from '../../constants/styles';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {accountActions} from '../../store/account-slice';
import {AccountType} from '../../models/account';
import {AccountCategory} from '../../dummy/account';
import {fetchCashAccountsData} from '../../store/cash-action';
import {fetchAccountsData} from '../../store/account-action';
import CButton from '../UI/CButton';
import {cashAccountsActions} from '../../store/cash-slice';

type Props = {
  isModalVisible: boolean;
  accountText: string | null;
  budget: number;
  setIsModalVisible: (value: boolean) => void;
  setAccountText: (value: string) => void;
  setBudget: (value: number) => void;
};

const {width, height} = Dimensions.get('window');
const WIDTH = width * 0.9;

const btnAccCashColor = '#ffe9b9';

const AddAccountForm = ({
  isModalVisible,
  setIsModalVisible,
  accountText,
  setAccountText,
  budget,
  setBudget,
}: Props) => {
  //
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const [filterData, setFilterData] = useState<any[]>();
  const [addAccPressed, setAddAccPressed] = useState<boolean>(false);
  const [selectedCash, setSelectedCash] = useState<boolean>(false);
  const [btnCashColor, setCashBtnColor] = useState<string | undefined>();
  const [btnAccColor, setAccBtnColor] = useState<string | undefined>(
    btnAccCashColor,
  );

  const accountsData = dataLoaded?.accounts?.accounts;

  useEffect(() => {
    setFilterData(accountsData);
  }, [addAccPressed]);

  function saveFormHandler() {
    // Reset State
    setIsModalVisible(false);
    setAddAccPressed(false);
  }

  function categoryHandler(item) {
    setAccountText(item?.title);
    setAddAccPressed(true);
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

  const addNewHandler = () => {
    console.log('add account');
    setAddAccPressed(true);
  };

  const closeHandler = () => {
    // Reset State
    setIsModalVisible(false);
    setAddAccPressed(false);
  };

  const saveAccountToStorage = () => {
    console.log('save account to cloud');
    // if (selectedCash) {
    //   const cashId = 'cash-' + uuidv4();
    //   // Create new Cash Account
    //   if (cashData?.length === 0) {
    //     dispatch(
    //       cashAccountsActions.addCashAccount({
    //         id: cashId,
    //         budget: budget,
    //         date: new Date(),
    //       }),
    //     );
    //   } else {
    //     // Update Cash Account
    //     dispatch(
    //       cashAccountsActions.updateCashAccount({
    //         id: cashData[0]?.id,
    //         budget: +cashData[0]?.budget + +budget,
    //         date: new Date(),
    //       }),
    //     );
    //   }
    // } else {
    //   //
    //   const accId = 'cash-' + uuidv4();
    //   const findAccTitle = accountsData?.findIndex(
    //     acc => acc?.title === accountText,
    //   );
    //   // dispatch account
    //   if (accountsData?.length === 0 || findAccTitle === -1) {
    //     dispatch(
    //       accountActions.addAccount({
    //         id: accId,
    //         title: accountText,
    //         budget: budget,
    //         date: new Date(),
    //         removable: true,
    //       }),
    //     );
    //   } else {
    //     Alert.alert('Account Warning', 'The account is in the list already.');
    //   }
    // }

    // Reset
    // setAddAccPressed(true);
  };

  const cashBtnPressedHandler = () => {
    console.log('cash pressed');
    setCashBtnColor(btnAccCashColor);
    setAccBtnColor(undefined);
    // Reset
    setSelectedCash(true);
  };

  const accBtnPressedHandler = () => {
    console.log('acc pressed');

    setCashBtnColor(undefined);
    setAccBtnColor(btnAccCashColor);

    // Reset
    setSelectedCash(false);
  };

  // Render Item
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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onDismiss={() => setIsModalVisible(false)}
      onRequestClose={() => setIsModalVisible(false)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => closeHandler()}>
            <View style={styles.close}>
              <Ionicons name="close" size={width * 0.07} color="#454545" />
            </View>
          </Pressable>

          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => saveFormHandler()}>
            <View>
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
        </View>

        <View style={styles.accountsBtn}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => cashBtnPressedHandler()}>
            <View style={[styles.accountBtn, {backgroundColor: btnCashColor}]}>
              <Text>Cash</Text>
            </View>
          </Pressable>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => accBtnPressedHandler()}>
            <View style={[styles.accountBtn, {backgroundColor: btnAccColor}]}>
              <Text>Accounts</Text>
            </View>
          </Pressable>
        </View>

        {selectedCash && (
          <View style={{marginLeft: 20}}>
            <Text
              style={{
                fontSize: width * 0.05,
                fontWeight: '800',
                marginLeft: 20,
                marginTop: 20,
              }}>
              Cash
            </Text>
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
            </View>
          </View>
        )}

        {!selectedCash && (
          <>
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
                onPress={() => addNewHandler()}>
                <Text style={{fontWeight: '800', color: '#0439c2'}}>
                  add new
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {addAccPressed && !selectedCash && (
          <>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Please enter budget amount."
                keyboardType="numeric"
                // onChange={event => {
                //   searchFilterHandler(event.nativeEvent.text);
                // }}
                onChangeText={setBudget}
                value={budget}
              />
              <Pressable
                style={({pressed}) => pressed && styles.pressed}
                onPress={() => saveAccountToStorage()}>
                <Text style={{fontWeight: '800', color: '#0439c2'}}>
                  save acc
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {!selectedCash && (
          <FlatList
            keyExtractor={item => item.title + uuidv4()}
            data={filterData}
            renderItem={renderItem}
            bounces={false}
          />
        )}
      </View>
    </Modal>
  );
};

export default AddAccountForm;

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: height * 0.75,
    marginHorizontal: 20,
    marginTop: 100,

    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 4,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  close: {
    backgroundColor: 'lightgrey',
    borderColor: 'white',

    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 4,
  },
  accountsBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  accountBtn: {
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: height * 0.008,
    width: WIDTH / 2,
    borderColor: 'lightgrey',
    backgroundColor: 'white',

    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 3,
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

import {
  Alert,
  ColorValue,
  Dimensions,
  FlatList,
  Modal,
  Platform,
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

import {useAppDispatch, useAppSelector} from '../../hooks';
import {accountActions} from '../../store/account-slice';
import {cashAccountsActions} from '../../store/cash-slice';
import moment from 'moment';
import DateTimePick from '../UI/DateTimePick';

// Constant
const {width, height} = Dimensions.get('window');
const WIDTH = width * 0.9;
const btnAccCashColor = '#ffe9b9';
const initDate = moment().format('YYYY-MM-DD HH:mm:ss');

const AddAccountForm = ({
  IsAccFormVisible,
  setIsAccFormVisible,
  accountText,
  setAccountText,
  addAccPressed,
  setAddAccPressed,
  budget,
  setBudget,
  isEditAccount,
  setIsEditAccount,
  isEditCash,
  setIsEditCash,
  month,
  year,
  lastEditedDate,
}: Props) => {
  // Initial variables
  const textDateInit =
    isEditCash || isEditAccount
      ? lastEditedDate
      : moment().format('YYYY-MM-DD HH:mm:ss');

  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const accountsData = dataLoaded?.accounts?.accounts;
  const cashData = dataLoaded?.cashAccounts?.cashAccounts;

  // const [value, setValue] = useState<number>(budget);
  const [filteredData, setFilteredData] = useState<any[]>();
  // const [addAccPressed, setAddAccPressed] = useState<boolean>(false);
  const [selectedCash, setSelectedCash] = useState<boolean>(false);
  const [savedAcc, setSavedAcc] = useState<boolean>(false);
  const [btnCashColor, setCashBtnColor] = useState<ColorValue | undefined>();
  const [btnAccColor, setAccBtnColor] = useState<ColorValue | undefined>(
    btnAccCashColor,
  );
  const [mode, setMode] = useState('datetime');
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [DATE, setDATE] = useState(initDate);
  const [textDate, setTextDate] = useState<string>();

  // useEffect
  useEffect(() => {
    setFilteredData(accountsData);
    setTextDate(textDateInit);
  }, []);

  useEffect(() => {
    setTextDate(textDateInit);
  }, [addAccPressed]);

  useEffect(() => {
    // setFilteredData(accountsData);
    searchFilterHandler(accountText);
  }, [accountText]);

  useEffect(() => {
    searchFilterHandler(accountText);
  }, [savedAcc]);

  useEffect(() => {
    if (isEditAccount) {
      accBtnPressedHandler();
    }
    if (isEditCash) {
      cashBtnPressedHandler();
    }
  }, [isEditCash, isEditAccount]);

  // Search Filtered Data
  function searchFilterHandler(text: string) {
    if (text) {
      const newData = accountsData?.filter(item => {
        const itemData = item?.title
          ? item?.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(accountsData);
    }
  }

  // Reset
  function resetHandler() {
    // Reset State
    setIsAccFormVisible(false);
    setAddAccPressed(false);
    setSavedAcc(false);
    setBudget(undefined);
    setAccountText(null);
    setIsEditAccount(false);
    setIsEditCash(false);
    setSelectedCash(false);
    setCashBtnColor('');
    setAccBtnColor(btnAccCashColor);
    setAccountText('');
  }

  // Close
  const closeHandler = () => {
    // Reset State
    resetHandler();
  };

  function categoryHandler(item) {
    setAccountText(item?.title);
    setAddAccPressed(true);
  }

  const addAccHandler = () => {
    if (accountText === null) {
      Alert.alert('You enter invalid input!');
      return;
    }
    setAddAccPressed(true);
  };

  // Save budget to account
  const saveAccountHandler = () => {
    if (
      budget <= 0 ||
      budget === undefined ||
      accountText === null ||
      accountText === ''
    ) {
      Alert.alert('You enter invalid information!');
      return;
    }

    setSavedAcc(true);
    const findAcc = accountsData?.filter(
      acc =>
        acc?.title === accountText &&
        +moment(acc?.date).month() === +moment(textDate).month() &&
        +moment(acc?.date).year() === +moment(textDate).year(),
    );
    // add new account
    // if (accountsData?.length === 0 || findAccTitle === -1) {
    if (findAcc?.length === 0) {
      const accId = 'account-' + uuidv4();
      dispatch(
        accountActions.addAccount({
          id: accId,
          title: accountText,
          budget: +budget,
          date: textDate,
          editedDate: textDate,
        }),
      );
    } else {
      if (isEditAccount) {
        // Edit account
        dispatch(
          accountActions.updateAccount({
            id: findAcc[0]?.id,
            title: accountText,
            budget: +budget,
            date: findAcc?.date,
            editedDate: textDate,
          }),
        );
        setIsEditAccount(false);
      } else {
        // Update the account
        dispatch(
          accountActions.updateAccount({
            id: findAcc[0]?.id,
            title: accountText,
            budget: +findAcc[0]?.budget + +budget,
            date: findAcc?.date,
            editedDate: textDate,
          }),
        );
      }
    }
    resetHandler();
  };

  // Save cash account
  const saveCashHandler = () => {
    if (budget <= 0 || budget === undefined || accountText === null) {
      Alert.alert('Category or budget is invalid');
      return;
    }
    const findCash = cashData?.filter(
      cash =>
        +moment(cash.date).month() === +moment(textDate).month() &&
        +moment(cash.date).year() === +moment(textDate).year(),
    );
    // Create new Cash Account
    if (findCash?.length <= 0) {
      const cashId = 'cash-' + uuidv4();
      dispatch(
        cashAccountsActions.addCashAccount({
          id: cashId,
          title: 'Cash',
          budget: +budget,
          date: textDate,
          editedDate: textDate,
        }),
      );
    } else {
      if (isEditCash) {
        // Update Cash Account
        dispatch(
          cashAccountsActions.updateCashAccount({
            id: findCash[0]?.id,
            title: 'Cash',
            budget: +budget,
            date: findCash[0]?.date,
            editedDate: textDate,
          }),
        );
        setIsEditCash(false);
      } else {
        // Update Cash Account
        dispatch(
          cashAccountsActions.updateCashAccount({
            id: findCash[0]?.id,
            title: 'Cash',
            budget: +findCash[0]?.budget + +budget,
            date: findCash[0]?.date,
            editedDate: textDate,
          }),
        );
      }
    }
    resetHandler();
  };

  const cashBtnPressedHandler = () => {
    setCashBtnColor(btnAccCashColor);
    setAccBtnColor(undefined);
    setAccountText('cash');

    // Reset
    setSelectedCash(true);
  };

  const accBtnPressedHandler = () => {
    setCashBtnColor(undefined);
    setAccBtnColor(btnAccCashColor);
    if (!isEditAccount) {
      setAccountText('');
    } else {
      setAccountText(accountText);
    }

    // Reset
    setSelectedCash(false);
  };

  const openCalendar = () => {
    setIsDatePickerVisible(true);
  };

  function onChange(event, selectedDate) {
    const currentDate = selectedDate || DATE;
    if (Platform.OS === 'android') {
      setIsDatePickerVisible(true);
    }
    setDATE(currentDate);

    let fDate = moment(event).format('YYYY-MM-DD HH:mm:ss');
    setTextDate(fDate);
  }

  function hideDatePicker() {
    setIsDatePickerVisible(false);
  }

  const handleConfirm = date => {
    setTextDate(moment(date).format('YYYY-MM-DD HH:mm:ss'));
    setDATE(date);
    hideDatePicker();
  };

  function onTodayHandler() {
    setDATE(new Date().toISOString());
    setTextDate(moment().format('YYYY-MM-DD HH:mm:ss'));
  }

  // Calendar Input
  const CalendarInput = ({style, iconSize}) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={[styles.textInput, style]}
          placeholder="YYYY-MM-DD"
          // keyboardType="numeric"
          // onChangeText={}
          editable={false}
          value={moment(textDate).format('YYYY-MM-DD')}
        />
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => openCalendar()}>
          <MaterialCommunityIcons
            name="calendar"
            size={iconSize}
            color={'#1c6bea'}
          />
        </Pressable>
      </View>
    );
  };

  // cash btn
  const CashBtn = () => {
    return (
      <Pressable
        disabled={isEditAccount}
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => cashBtnPressedHandler()}>
        <View style={[styles.accountBtn, {backgroundColor: btnCashColor}]}>
          <Text>Cash</Text>
        </View>
      </Pressable>
    );
  };

  // account btn
  const AccountBtn = () => {
    return (
      <Pressable
        disabled={isEditCash}
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => accBtnPressedHandler()}>
        <View style={[styles.accountBtn, {backgroundColor: btnAccColor}]}>
          <Text>Accounts</Text>
        </View>
      </Pressable>
    );
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
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={IsAccFormVisible}
        onDismiss={() => setIsAccFormVisible(false)}
        onRequestClose={() => setIsAccFormVisible(false)}>
        {/* <Pressable
        style={styles.outSide}
        onPress={() => setIsAccFormVisible(false)}> */}

        {/* <Pressable onPress={() => setIsAccFormVisible(true)}> */}
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.close}>
              <Pressable
                style={({pressed}) => pressed && styles.pressed}
                onPress={() => closeHandler()}>
                <MaterialCommunityIcons
                  name="close-box-outline"
                  size={width * 0.09}
                  // color="#454545"
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.accountsBtn}>
            <CashBtn />
            <AccountBtn />
          </View>

          {selectedCash && (
            <View>
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
                  placeholder="Please enter budget amount."
                  keyboardType="numeric"
                  // defaultValue={''}
                  value={budget !== undefined ? String(budget) : ''}
                  onChangeText={text => setBudget(text)}
                />
              </View>
              <CalendarInput iconSize={width * 0.075} />

              <View
                style={{
                  alignItems: 'center',
                  marginTop: 25,
                }}>
                <Pressable
                  style={({pressed}) => pressed && styles.pressed}
                  onPress={() => saveCashHandler()}>
                  <Text style={styles.save}>save</Text>
                </Pressable>
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
                  editable={!isEditAccount}
                  style={styles.textInput}
                  placeholder="search or add category"
                  onChange={event => {
                    searchFilterHandler(event.nativeEvent.text);
                  }}
                  onChangeText={setAccountText}
                  value={addAccPressed ? accountText : filteredData}
                />
                <Pressable
                  style={({pressed}) => pressed && styles.pressed}
                  onPress={() => addAccHandler()}>
                  <Text style={styles.add}>add</Text>
                </Pressable>
              </View>
            </>
          )}

          {!selectedCash && addAccPressed && (
            <>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Please enter budget amount."
                  keyboardType="numeric"
                  // defaultValue={''}
                  value={budget !== undefined ? String(budget) : ''}
                  onChangeText={text => setBudget(text)}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20,
                  marginTop: 10,
                }}>
                <CalendarInput iconSize={width * 0.075} />
              </View>

              <View style={{alignItems: 'center', marginTop: 10}}>
                <Pressable
                  style={({pressed}) => pressed && styles.pressed}
                  onPress={() => saveAccountHandler()}>
                  <Text style={styles.save}>save</Text>
                </Pressable>
              </View>
            </>
          )}

          {!selectedCash && (
            <FlatList
              keyExtractor={item => item.title + uuidv4()}
              data={filteredData}
              renderItem={renderItem}
              bounces={false}
            />
          )}
        </View>
        {/* </Pressable> */}
        {/* </Pressable> */}
      </Modal>

      <DateTimePick
        isVisible={isDatePickerVisible}
        onChange={onChange}
        onCancel={hideDatePicker}
        onConfirm={handleConfirm}
        value={DATE}
        mode={mode}
        today={onTodayHandler}
        // style={{position: 'absolute'}}
      />
    </>
  );
};

export default AddAccountForm;

// Style
const styles = StyleSheet.create({
  container: {
    width: width * 0.95,
    height: height * 0.85,
    marginHorizontal: 10,
    marginTop: height * 0.09,

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
    marginBottom: 25,
    // backgroundColor: 'magenta',
  },
  // outSide: {
  //   flex: 1,
  //   backgroundColor: 'transparent',
  // },
  close: {
    // backgroundColor: '#e6e6e6',
    // borderColor: '#fd3636',
    // width: WIDTH * 0.075,
    // height: WIDTH * 0.075,
    marginLeft: WIDTH - WIDTH * 0.1,

    // shadowOffset: {width: 0.5, height: 0.5},
    // shadowOpacity: 0.7,
    // shadowRadius: 2,
    // elevation: 4,
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
    shadowOpacity: 0.75,
    shadowRadius: 1,
    elevation: 1,
  },
  searchContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
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
  add: {
    fontSize: WIDTH * 0.055,
    fontWeight: '800',
    color: '#0439c2',
  },
  save: {
    fontSize: WIDTH * 0.065,
    fontWeight: '800',
    color: '#0439c2',
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

// =================================== TYPE ==========================================
type Props = {
  IsAccFormVisible: boolean;
  accountText: string;
  addAccPressed: boolean;
  budget: number;
  isEditAccount: boolean;
  isEditCash: boolean;
  year: number;
  month: number;
  lastEditedDate: string;
  setBudget: (value: number | undefined) => void;
  setIsEditAccount: (value: boolean) => void;
  setIsEditCash: (value: boolean) => void;
  setAddAccPressed: (value: boolean) => void;
  setIsAccFormVisible: (value: boolean) => void;
  setAccountText: (value: string | null) => void;
};

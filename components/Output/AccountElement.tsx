import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {v4 as uuidv4} from 'uuid';

import {currencyFormatter} from '../../util/currencyFormatter';
import {accountActions} from '../../store/account-slice';
import {useAppDispatch} from '../../hooks';
import AccountHeader from '../AccountHeader';

type Props = {
  setIsModalVisible: (value: boolean) => void;
  setAccountText: (value: string) => void;
  setAddAccPressed: (value: boolean) => void;
  setBudget: (value: number) => void;
  setIsEditAccount: (value: boolean) => void;
  setRemoveAccount: (value: boolean) => void;
  cashData: any[];
  accountsData: any[];
  sortedItems: any[];
  cashBudget: number | undefined;
  accountsBudget: number | undefined;
  totalExpenses: number | undefined;
};

const {width, height} = Dimensions.get('window');

const AccountElement = ({
  setIsModalVisible,
  setAccountText,
  setAddAccPressed,
  setBudget,
  setIsEditAccount,
  // setRemoveAccount,
  cashData,
  accountsData,
  sortedItems,
  cashBudget,
  accountsBudget,
  totalExpenses,
  onPress,
}: Props) => {
  const dispatch = useAppDispatch();

  const totalAssets = Number(cashBudget) + Number(accountsBudget);
  const total = totalAssets - +totalExpenses;

  const editAccountPressedHandler = (accId: string) => {
    const findAcc = accountsData?.filter(acc => acc?.id === accId);

    setIsModalVisible(true);
    setIsEditAccount(true);
    setAddAccPressed(true);
    setAccountText(findAcc[0]?.title);
    setBudget(findAcc[0]?.budget);
  };

  const removeAccountHandler = (accountId: string) => {
    // setRemoveAccount(true);
    const findAcc = accountsData?.filter(acc => acc?.id === accountId);

    if (findAcc?.length > 0) {
      dispatch(
        accountActions.deleteAccount({
          accountId,
        }),
      );
    } else {
      Alert.alert('Account Warning!', 'The account cannot be removed.');
    }
    // setRemoveAccount(false);
  };

  const renderItem = ({item}) => {
    const accBalance = +item.budget - Number(totalExpenses);

    if (+item.budget === 0) return;

    return (
      <View>
        <Pressable
          key={item}
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => onPress(item)}
          onLongPress={() =>
            Alert.alert(
              'Edit or Delete?',
              'You can Edit or remove the account.',
              [
                {
                  text: 'Edit',
                  onPress: () => editAccountPressedHandler(item?.id),
                  // style: 'cancel',
                },
                {
                  text: 'Delete',
                  onPress: () => removeAccountHandler(item?.id),
                },
                {
                  text: 'Cancel',
                  // onPress: () => editAccountPressedHandler(item?.id),
                  style: 'cancel',
                },
              ],
              {
                cancelable: true,
                // onDismiss: () =>
                //   Alert.alert(
                //     'This alert was dismissed by tapping outside of the alert dialog.',
                //   ),
              },
            )
          }>
          <View style={styles.item}>
            <View>
              <Text style={{fontSize: 16}}>{item.title}</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'blue'}}>
                {currencyFormatter(+accBalance, {})}
              </Text>
              <Text style={{fontSize: 11, marginTop: 10}}>
                ({currencyFormatter(+item.budget, {})} budget)
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AccountHeader
        totalAssets={totalAssets}
        totalExpenses={totalExpenses}
        total={total}
      />

      <View style={styles.accountsContainer}>
        <View>
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
            data={sortedItems}
            renderItem={renderItem}
            bounces={false}
          />
        </View>
      </View>
    </View>
  );
};

export default AccountElement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width,
    height: height * 0.55,
    marginTop: 20,
    // backgroundColor: 'red',
  },
  // headerBox: {
  //   // backgroundColor: 'red',
  //   width: (width * 0.8) / 4,
  //   alignSelf: 'center',
  // },
  // headerText: {
  //   alignSelf: 'center',
  //   fontSize: 14,
  // },
  // headerValueText: {
  //   alignSelf: 'center',
  //   fontSize: 15,
  // },
  accountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 5,
  },
  // accounts: {
  //   marginBottom: 50,
  // },
  // addButton: {
  //   flexDirection: 'row',
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  //   width: width * 0.8,
  //   marginTop: height * 0.78,
  //   marginBottom: 5,
  //   marginLeft: width * 0.14,
  // },
  pressed: {
    opacity: 0.65,
  },
});

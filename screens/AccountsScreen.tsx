import {StyleSheet, Dimensions, View, Pressable} from 'react-native';
import React, {useState} from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import {AccountNavigationType} from '../types';
import AccountComponents from './screenComponents/AccountComponents';
import AddAccountBtn from '../components/UI/AddAccountBtn';

type Props = {
  navigation: AccountNavigationType;
};

const {width, height} = Dimensions.get('window');

const AccountsScreen = ({navigation}: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  function openAddAccountForm() {
    setIsModalVisible(pressed => !pressed);
  }

  function onAccountsHandler(item) {
    navigation.navigate('AccountsItem', {
      account: item.title,
      accountId: item.id,
    });
  }

  return (
    <View style={styles.container}>
      <AccountComponents
        navigation={navigation}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onNavigate={onAccountsHandler}
      />
      <AddAccountBtn onPress={openAddAccountForm} />
    </View>
  );
};

export default AccountsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

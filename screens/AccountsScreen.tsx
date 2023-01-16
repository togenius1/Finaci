import {
  StyleSheet,
  Dimensions,
  View,
  Pressable,
  Text,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {AccountNavigationType} from '../types';
import AccountComponents from '../components/Output/AccountComponents';

type Props = {
  navigation: AccountNavigationType;
};

const {width, height} = Dimensions.get('window');

const HeaderRightComponent = ({setIsMenuOpen}) => {
  return (
    <View>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={setIsMenuOpen}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#ffd3d3',
            marginRight: 15,
          }}>
          <MaterialCommunityIcons
            name={'dots-vertical'}
            size={width * 0.06}
            color={'black'}
          />
        </View>
      </Pressable>
    </View>
  );
};

const AccountsScreen = ({navigation}: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Accounts',
      headerRight: () => (
        <HeaderRightComponent
          setIsMenuOpen={() => setIsMenuOpen(true)}
          // setIsModalVisible={setIsModalVisible}
        />
      ),
    });
  }, []);

  const openAddAccountForm = () => {
    setIsModalVisible(true);
    setIsMenuOpen(false);
  };

  function onNavigate(item) {
    // console.log(item);
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
        // onNavigate={onNavigate}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuOpen}
        onDismiss={() => setIsMenuOpen(false)}
        onRequestClose={() => setIsMenuOpen(false)}>
        <Pressable style={styles.outSide} onPress={() => setIsMenuOpen(false)}>
          <View style={styles.menu}>
            <Pressable
              onPress={openAddAccountForm}
              style={({pressed}) => pressed && styles.pressed}>
              <View style={{marginTop: 10, marginLeft: 10}}>
                <Text style={{fontSize: width * 0.045, fontWeight: '500'}}>
                  Add
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default AccountsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    width: width * 0.45,
    height: height * 0.2,
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: '#d4d4d4',

    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,

    position: 'absolute',
    right: 0,
    top: height / 16,
  },
  outSide: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.65,
  },
});

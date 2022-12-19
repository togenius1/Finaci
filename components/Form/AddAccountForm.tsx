import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Input from '../ManageExpense/Input';
import Button from '../UI/CButton';
import {GlobalStyles} from '../../constants/styles';

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
  saveFormHandler,
}: Props) => {
  //

  const checkedBox = () => {
    setSelectedCash(pressed => !pressed);
  };

  return (
    <Modal
      transparent={true}
      visible={isModalVisible}
      onDismiss={() => setIsModalVisible(false)}
      onRequestClose={() => setIsModalVisible(false)}>
      <View style={styles.addAccountForm}>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => setIsModalVisible(false)}>
          <View
            style={{
              position: 'absolute',
              right: -140,
              // top: 5,
              backgroundColor: '#e8e8e8',
            }}>
            <MaterialCommunityIcons
              name="close"
              size={width * 0.08}
              color="#000000"
            />
          </View>
        </Pressable>

        {!editAccount && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: -(width / 2) + 25,
            }}>
            <Pressable
              style={({pressed}) => pressed && styles.pressed}
              onPress={() => checkedBox()}>
              {selectedCash ? (
                <MaterialCommunityIcons
                  name="checkbox-outline"
                  size={32}
                  color="#000000"
                />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={32}
                  color="#000000"
                />
              )}
            </Pressable>
            <Text style={{marginLeft: 10, fontSize: 16}}>Cash</Text>
          </View>
        )}

        <Input
          label={selectedCash ? 'Cash' : 'Account'}
          style={styles.input}
          textInputConfig={{
            onChangeText: setAccountText,
            value: selectedCash ? 'Cash' : accountText,
            editable: !selectedCash,
            placeholder: selectedCash ? 'Cash' : 'account name',
            backgroundColor: selectedCash
              ? 'lightgrey'
              : GlobalStyles.colors.primary100,
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
    </Modal>
  );
};

export default AddAccountForm;

const styles = StyleSheet.create({
  addAccountForm: {
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    height: height * 0.35,
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

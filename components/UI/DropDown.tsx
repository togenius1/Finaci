import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

import {GlobalStyles} from '../../constants/styles';

type Props = {};

const DropDown = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
  placeholder,
  showArrowIcon,
  showTickIcon,
  style,
}: Props) => {
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder={placeholder}
      showArrowIcon={showArrowIcon}
      showTickIcon={showTickIcon}
      style={style}
      placeholderStyle={{
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 14,
      }}
      dropDownContainerStyle={{
        backgroundColor: 'white',
        width: 130,
        elevation: 10,
        borderColor: 'grey',
      }}
    />
  );
};

export default DropDown;

const styles = StyleSheet.create({});

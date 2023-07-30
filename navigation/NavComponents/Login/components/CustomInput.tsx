import {StyleSheet, View, TextInput, Platform, Text} from 'react-native';
import React from 'react';
import {Controller, FieldValues} from 'react-hook-form';

type Props = {
  control: FieldValues;
  name: string;
  rules: object | null;
  value: string | undefined;
  placeholder: string | undefined;
  secureTextEntry: boolean;
};

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
}: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View
            style={[
              styles.container,
              {borderColor: error ? 'red' : '#e8e8e8'},
            ]}>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              style={[styles.input]}
              secureTextEntry={secureTextEntry}
            />
          </View>
          {error && (
            <Text style={{color: 'red', alignSelf: 'stretch'}}>
              {error.message || 'Error'}
            </Text>
          )}
        </>
      )}
    />
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgrey',
    width: '100%',

    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 1,
    marginVertical: 5,
  },
  input: {},
});

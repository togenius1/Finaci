import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useForm} from 'react-hook-form';
// import {Auth} from 'aws-amplify';
import { type ConfirmResetPasswordInput, confirmResetPassword } from 'aws-amplify/auth';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

type Props = {};

export default function NewPasswordScreen({navigation}: Props) {
  const {control, handleSubmit} = useForm();

  const onSubmitPressed = async (data) => {
    const username = data.username
    const confirmationCode = data.code
    const newPassword = data.password
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword });
      navigation.navigate('SignIn');
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
  };

  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>

        <CustomInput
          name="username"
          control={control}
          placeholder="Username"
          rules={{
            required: 'Username is required',
          }}
        />

        <CustomInput
          name="code"
          control={control}
          placeholder="Code"
          rules={{
            required: 'Code is required',
          }}
        />
        <CustomInput
          name="password"
          control={control}
          placeholder="Enter your new password"
          secureTextEntry
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 characters long',
            },
          }}
        />

        <CustomButton text="Submit" onPress={handleSubmit(onSubmitPressed)} />

        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

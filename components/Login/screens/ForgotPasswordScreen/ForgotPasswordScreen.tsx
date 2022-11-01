import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useForm} from 'react-hook-form';
import {Auth} from 'aws-amplify';

import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';

type Props = {};

export default function ForgotPasswordScreen({navigation}: Props) {
  const {control, handleSubmit} = useForm();

  const onSendPressed = async data => {
    try {
      await Auth.forgotPassword(data.username);
      navigation.navigate('NewPassword');
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

        <CustomButton text="send" onPress={handleSubmit(onSendPressed)} />

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

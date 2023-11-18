import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {DataStore} from 'aws-amplify';
import {isValidPhoneNumber} from 'react-phone-number-input';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {User} from '../../../../src/models';
import {signUp} from 'aws-amplify/auth';
// import SocialSignInButtons from '../components/SocialSignInButtons';

type Props = {};

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function SignUpScreen({navigation}: Props) {
  const {control, handleSubmit, watch} = useForm();
  const pwd = watch('password');

  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);

  const onRegisterPressed = async data => {
    const {username, password, email, name, phone_number} = data;

    try {
      // Check if the email is already registered (duplicate)
      const isDuplicate = await checkEmailDuplicate(email);

      if (isDuplicate) {
        setIsEmailDuplicate(true); // Set state to indicate duplicate email
      } else {
        const response = await signUp({
          username,
          password,
          // attributes: {email, name, preferred_username: username},
          options: {
            userAttributes: {
              email: email,
              phone_number: phone_number, // E.164 number convention
              given_name: name,
              family_name: '',
              nickname: '',
            },
          },
        });

        navigation.navigate('ConfirmEmail', {
          username,
        });
      }
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
  };

  // Function to check for duplicate email
  const checkEmailDuplicate = async (email: string) => {
    try {
      const users = await DataStore?.query(User, u => u?.email?.eq(email));

      return users?.length > 0; // Email is already registered if users array has any items
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };

  const onTermsOfUsePressed = () => {
    console.warn('onTermsOfUsePressed');
  };

  const onPrivacyPressed = () => {
    console.warn('onPrivacyPressed');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>

        <CustomInput
          name="name"
          control={control}
          placeholder="Name"
          rules={{
            required: 'Name is required',
            minLength: {
              value: 3,
              message: 'Name should be at least 3 characters long',
            },
            maxLength: {
              value: 24,
              message: 'Name should be at least 24 characters long',
            },
          }}
        />

        <CustomInput
          name="username"
          control={control}
          placeholder="Username"
          rules={{
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username should be at least 3 characters long',
            },
            maxLength: {
              value: 24,
              message: 'Username should be at least 24 characters long',
            },
          }}
        />
        <CustomInput
          name="email"
          control={control}
          placeholder="Email"
          rules={{
            required: 'Email is required',
            pattern: EMAIL_REGEX,
            message: 'Email is invalid',
          }}
        />
        <CustomInput
          name="phone_number"
          control={control}
          placeholder="+(country code) - Phone number. "
          rules={{
            validate: value => isValidPhoneNumber(value),
          }}
        />
        <CustomInput
          name="password"
          control={control}
          placeholder="Password"
          secureTextEntry
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 characters long',
            },
          }}
        />
        <CustomInput
          name="password_repeat"
          control={control}
          placeholder="Repeat Password"
          secureTextEntry
          rules={{
            validate: value => value === pwd || 'Password do not match',
          }}
        />

        <CustomButton
          text="Register"
          onPress={handleSubmit(onRegisterPressed)}
        />

        {isEmailDuplicate && (
          <Text style={{color: 'red'}}>Email is already registered</Text>
        )}

        <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            of Use
          </Text>
          and
          <Text style={styles.link} onPress={onPrivacyPressed}>
            Privacy Policy.
          </Text>
        </Text>

        {/* <SocialSignInButtons /> */}

        <CustomButton
          text="Have an account? Sign in"
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

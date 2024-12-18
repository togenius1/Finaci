import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Auth} from 'aws-amplify';

import Logo from '../../../../assets/images/Logo_1.png';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import SocialSignInButtons from '../components/SocialSignInButtons';

type Props = {};

const {height} = Dimensions.get('window');

const SignInScreen = ({navigation}: Props) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  // SIGN IN
  const onSignInPressed = async data => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await Auth.signIn(data.username, data.password);
      // console.log(response);
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
    setLoading(false);
  };

  // FORGOT PASSWORD
  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  // GO to SIGN UP
  const onSignUpPressed = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, {height: height * 0.3}]}
          resizeMode="contain"
        />
        <CustomInput
          name="username"
          placeholder="Username"
          control={control}
          rules={{
            required: 'Username is required',
          }}
        />
        <CustomInput
          name="password"
          placeholder="Password"
          secureTextEntry
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 5,
              message: 'Password should be minimum 5 characters long!',
            },
          }}
        />

        <CustomButton
          text={loading ? 'Loading...' : 'Log In'}
          onPress={handleSubmit(onSignInPressed)}
        />
        <CustomButton
          text="Forgot password"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

        <SocialSignInButtons />

        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

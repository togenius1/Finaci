import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Auth} from 'aws-amplify';

import CustomButton from '../CustomButton/CustomButton';

export default function SocialSignInButtons(props) {
  const onSignInFacebook = () => {
    // console.log('onSignInFacebook');
    Auth.federatedSignIn();
  };

  const onSignInGoogle = () => {
    // console.log('onSignInGoogle');
    Auth.federatedSignIn();
  };

  const onSignInApple = () => {
    console.log('onSignInApple');
  };

  const onSignUpPress = () => {
    console.log('onSignUpPress');
  };
//--------
  return (
    <>
      <CustomButton
        text="Sign In with Facebook"
        bgColor="#E7EAF4"
        fgColor="#4765A9"
        onPress={onSignInFacebook}
      />
      <CustomButton
        text="Sign In with Google"
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
        onPress={onSignInGoogle}
      />
      <CustomButton
        text="Sign In with Apple"
        bgColor="#e3e3e3"
        fgColor="#363636"
        onPress={onSignInApple}
      />
    </>
  );
}

const styles = StyleSheet.create({});

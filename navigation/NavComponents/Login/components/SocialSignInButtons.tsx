import {StyleSheet} from 'react-native';
import React from 'react';
import {Auth} from 'aws-amplify';
import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';

import CustomButton from './CustomButton';

export default function SocialSignInButtons(props) {
  const onSignInFacebook = () => {
    // console.log('onSignInFacebook');
    Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Facebook});
  };

  const onSignInGoogle = () => {
    // console.log('onSignInGoogle');
    Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google});
  };

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
    </>
  );
}

const styles = StyleSheet.create({});

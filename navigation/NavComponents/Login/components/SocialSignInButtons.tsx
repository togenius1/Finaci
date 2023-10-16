import {StyleSheet} from 'react-native';
import React from 'react';
import {Auth} from 'aws-amplify';
import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';

import CustomButton from './CustomButton';

export default function SocialSignInButtons(props) {
  const onSignInFacebook = async () => {
    try {
      const user = await Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Facebook,
      });

      const userEmail = user?.attributes
        ? user?.attributes?.email
        : 'Email not available';

      console.log('User email:---------', userEmail);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const onSignInGoogle = async () => {
    // Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google});
    try {
      const user = await Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Google,
      });

      // Make sure to check if user.attributes exists before accessing email
      const userEmail = user?.attributes
        ? user?.attributes?.email
        : 'Email not available';

      console.log('User email-------:', user);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <>
      {/* <CustomButton
        text="Sign In with Facebook"
        bgColor="#E7EAF4"
        fgColor="#4765A9"
        onPress={onSignInFacebook}
      /> */}
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

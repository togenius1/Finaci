import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {Auth} from 'aws-amplify';
import Purchases from 'react-native-purchases';

type Props = {};

const LoginForm = (props: Props) => {
  // const [newUserId, setNewUserId] = useState('');

  console.warn(
    "Public-facing usernames aren't optimal for user ID's - you should use something non-guessable, like a non-public database ID. For more information, visit https://docs.revenuecat.com/docs/user-ids.",
  );

  const login = async () => {
    // TODO login user and identify him with RevenueCat
    const authUser = await Auth.currentAuthenticatedUser();

    const {customerInfo, created} = await Purchases.logIn(
      authUser?.attributes?.sub,
    );
  };

  return (
    <>
      <Text style={styles.headline}>Login</Text>
      <TextInput
        // value={newUserId}
        // onChangeText={setNewUserId}
        onEndEditing={login}
        placeholder="Enter App User ID"
        placeholderTextColor="lightgrey"
        style={styles.input}
      />
    </>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  headline: {
    color: 'white',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 18,
    paddingTop: 24,
    paddingBottom: 8,
  },
  input: {
    paddingTop: 8,
    color: 'white',
  },
});

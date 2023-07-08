import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

type Props = {};

const LogoutButton = (props: Props) => {
  const logout = async () => {
    // TODO logout the user
  };

  return (
    <Pressable onPress={logout} style={styles.button}>
      <Text style={styles.text}>Logout</Text>
    </Pressable>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  button: {
    marginTop: 'auto',
  },
  text: {
    color: 'red',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 18,
  },
});

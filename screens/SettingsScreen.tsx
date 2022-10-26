import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';

type Props = {};

const {width, height} = Dimensions.get('window');

function Settings(props: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.currency, styles.box]}>
        <Text style={styles.text}>Account</Text>
      </View>
      <View style={[styles.currency, styles.box]}>
        <Text style={styles.text}>Currency</Text>
      </View>
      <View style={[styles.currency, styles.box]}>
        <Text style={styles.text}>Manage Category</Text>
      </View>
      <View style={[styles.passcode, styles.box]}>
        <Text style={styles.text}>Passcode / fingerprint / Face ID lock</Text>
      </View>
      <View style={[styles.notification, styles.box]}>
        <Text style={styles.text}>Notifications</Text>
        <Text style={[styles.text, {marginTop: 20}]}>Appearance</Text>
      </View>
      <View>
        <Text>Finner version 1.0.0</Text>
      </View>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#dedede',
  },
  box: {
    width,
    margin: 10,
    elevation: 3,
    shadowColor: '#c6c6c6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  currency: {
    paddingVertical: 20,
    marginTop: 20,
  },
  passcode: {
    paddingVertical: 20,
  },
  notification: {
    paddingVertical: 20,
  },
  text: {
    fontSize: 16,
    marginLeft: 15,
  },
});

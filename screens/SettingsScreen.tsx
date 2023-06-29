import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Auth} from 'aws-amplify';

import CButton from '../components/UI/CButton';

// Constant
const {width, height} = Dimensions.get('window');

const Settings = () => {
  const [showDeleteIndicator, setShowDeleteIndicator] =
    useState<boolean>(false);

  // Alert closing account request
  const closeAccountAlertHandler = () => {
    Alert.alert(
      'Do you want to close your account now?',
      'After closing your account, you can create a new account at any time.',
      [
        {
          text: 'Yes',
          onPress: () => closeAccountHandler(),
          // style: 'cancel',
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
        // onDismiss: () =>
        //   Alert.alert(
        //     'This alert was dismissed by tapping outside of the alert dialog.',
        //   ),
      },
    );
  };

  // Close account
  const closeAccountHandler = async () => {
    setShowDeleteIndicator(true);

    try {
      const result = await Auth.deleteUser();

      // Remove old key

      // Remove Data from local storage
      //...

      // console.log(result);
    } catch (error) {
      console.log('Error deleting user', error);
    }

    setShowDeleteIndicator(false);
  };

  return (
    <View style={styles.container}>
      {/* <View style={[styles.currency, styles.box]}>
        <Text style={styles.text}>Currency</Text>
      </View>

      <View style={[styles.passcode, styles.box]}>
        <Text style={styles.text}>Passcode / fingerprint / Face ID lock</Text>
      </View>
      <View style={[styles.notification, styles.box]}>
        <Text style={styles.text}>Notifications</Text>
        <Text style={[styles.text, {marginTop: 20}]}>Appearance</Text>
      </View>
      <View>
        <Text>Finner version 1.0.5</Text>
      </View> */}

      <View style={styles.closeAccount}>
        <CButton onPress={closeAccountAlertHandler}>Close account</CButton>
        <ActivityIndicator
          size="small"
          color="#0000ff"
          animating={showDeleteIndicator}
        />
      </View>
    </View>
  );
};

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
  closeAccount: {
    marginTop: height / 4,
  },
  text: {
    fontSize: 16,
    marginLeft: 15,
  },
  pressed: {
    opacity: 0.65,
  },
});

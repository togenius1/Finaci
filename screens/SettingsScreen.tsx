import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Auth} from 'aws-amplify';
import DeviceInfo from 'react-native-device-info';

import CButton from '../components/UI/CButton';
import {useAppDispatch, useAppSelector} from '../hooks';
import {authAccountsActions} from '../store/authAccount-slice';

// Constant
const {width, height} = Dimensions.get('window');

const Settings = () => {
  const dispatch = useAppDispatch();
  // const dataLoaded = useAppSelector(store => store);

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
      const authUser = await Auth.currentAuthenticatedUser();
      const subId = String(authUser?.attributes?.sub);
      // Delete account from local storage
      dispatch(
        authAccountsActions.deleteAuthAccount({
          id: subId,
        }),
      );

      // Delete account from cloud storage
      const result = await Auth.deleteUser();
      // console.log(result);
    } catch (error) {
      console.log('Error deleting user', error);
    }

    setShowDeleteIndicator(false);
  };

  const handleEmailLinkPress = () => {
    const emailAddress = 'togenius1@gmail.com'; // Replace this with the desired email address
    // const subject = 'Hello from Finner App'; // Replace this with the desired email subject

    const mailToUrl = `mailto:${emailAddress}?subject=SendMail&body=Description`;

    Linking.openURL(mailToUrl).then(supported => {
      console.log(supported);
      if (supported) {
        Linking.openURL(mailToUrl);
      } else {
        console.log("Can't handle URL: " + mailToUrl);
      }
    });

    // Linking.canOpenURL(mailToUrl).then(supported => {
    //   if (supported) {
    //     Linking.openURL(mailToUrl);
    //   } else {
    //     console.log("Can't handle URL: " + mailToUrl);
    //   }
    // });
  };

  const currentVersion = DeviceInfo.getVersion();

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
        {/* <View>
          <Text>
            Please keep in mind that once the account removal process is
            completed, there will be no way to retrieve any of your previous
            data or information. Therefore, we recommend ensuring that you have
            backed up any important data before proceeding with the account
            removal. When you decide to return, you can simply sign up again
            using your preferred credentials, and we'll be happy to have you
            back as a valued member of our community. If you have any questions
            or concerns regarding the account removal process or need any
            assistance, please feel free to reach out to our support team. We
            are here to help and ensure your experience with us is as smooth and
            satisfactory as possible.
          </Text>
        </View> */}

        <CButton onPress={closeAccountAlertHandler}>Close account</CButton>
        <ActivityIndicator
          size="small"
          color="#0000ff"
          animating={showDeleteIndicator}
        />
      </View>

      <View style={{flexDirection: 'row', marginVertical: 10}}>
        <Text style={{}}>Contact: </Text>
        <Pressable onPress={handleEmailLinkPress}>
          <Text style={{color: 'blue'}}>togenius1@gmail.com</Text>
        </Pressable>
      </View>
      <Text style={{fontSize: 11}}>{`Version: ${currentVersion}`}</Text>
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

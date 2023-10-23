import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  // TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Auth} from 'aws-amplify';
import DeviceInfo, {isTablet} from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';

import CButton from '../components/UI/CButton';
import {useAppDispatch, useAppSelector} from '../hooks';
import {authAccountsActions} from '../store/authAccount-slice';
import axios from 'axios';
// import {setPasscode, updatePasscode} from '../store/passcode-slice';

// Constant
const {width, height} = Dimensions.get('window');

const Settings = () => {
  const dispatch = useAppDispatch();
  // const dataLoaded = useAppSelector(store => store);
  // const passcodeState = useAppSelector(state => state.passcode);

  const navigation = useNavigation();

  const currentVersion = DeviceInfo.getVersion();

  const [showDeleteIndicator, setShowDeleteIndicator] =
    useState<boolean>(false);
  // const [newPasscode, setNewPasscode] = useState('');
  // const inputRefs = Array.from({length: 4}, () => React.createRef());

  // const setPasscodeHandler = () => {
  //   if (newPasscode.trim() === '') {
  //     // Handle empty passcode input
  //     return;
  //   }
  //   dispatch(setPasscode(newPasscode));
  //   setPasscode('');
  // };

  // const updatePasscodeHandler = () => {
  //   if (newPasscode.trim() === '') {
  //     // Handle empty passcode input
  //     return;
  //   }
  //   dispatch(updatePasscode(newPasscode));
  //   setPasscode('');
  // };

  // const renderPasscodeInputs = () => {
  //   const passcodeLength = 4;

  //   return Array.from({length: passcodeLength}, (_, index) => (
  //     <TextInput
  //       key={index}
  //       style={styles.passcodeInput}
  //       maxLength={1}
  //       secureTextEntry
  //       keyboardType="numeric"
  //       onChangeText={text => handlePasscodeInput(text, index)}
  //       value={newPasscode[index] || ''}
  //     />
  //   ));
  // };

  // const handlePasscodeInput = (text, index) => {
  //   if (index < 3 && text) {
  //     const updatedPasscode = newPasscode.split('');
  //     updatedPasscode[index] = text;
  //     setNewPasscode(updatedPasscode.join(''));

  //     // Move focus to the next input box
  //     inputRefs[index + 1].focus();
  //   } else if (index === 3 && text) {
  //     const updatedPasscode = newPasscode.split('');
  //     updatedPasscode[index] = text;
  //     setNewPasscode(updatedPasscode.join(''));
  //     // Here, you can trigger the action to set/update passcode
  //   } else {
  //     // Handle deleting a digit or other cases
  //   }
  // };

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
      const user = await Auth.currentAuthenticatedUser();
      const sub = String(user?.attributes?.sub);

      // Delete account from local storage
      dispatch(
        authAccountsActions.deleteAuthAccount({
          id: sub,
        }),
      );

      // Delete account from cloud storage
      const result = await Auth.deleteUser();

      await Auth.signOut({global: true});
      navigation.navigate('User');
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
      if (supported) {
        Linking.openURL(mailToUrl);
      } else {
        console.log("Can't handle URL: " + mailToUrl);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* <View style={[styles.currency, styles.box]}>
        <Text style={styles.text}>Currency</Text>
      </View> */}

      {/* <View style={[styles.passcode, styles.box]}>
        <Text style={styles.text}>Passcode Setting</Text>
        <View style={styles.passcodeContainer}>{renderPasscodeInputs()}</View>
        <Pressable
          style={({pressed}) => [
            styles.passcodeButton,
            pressed && styles.pressed,
          ]}
          onPress={
            passcodeState?.isSet ? updatePasscodeHandler : setPasscodeHandler
          }>
          <Text style={styles.buttonText}>
            {passcodeState?.isSet ? 'Update Passcode' : 'Set Passcode'}
          </Text>
        </Pressable>
      </View> */}
      {/* <View style={[styles.notification, styles.box]}>
        <Text style={styles.text}>Notifications</Text>
        <Text style={[styles.text, {marginTop: 20}]}>Appearance</Text>
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
        <Text style={[styles.contactFontSize, {color: 'black'}]}>
          Contact:{' '}
        </Text>
        <Pressable onPress={handleEmailLinkPress}>
          <Text style={styles.contactFontSize}>togenius1@gmail.com</Text>
        </Pressable>
      </View>
      <Text
        style={{
          fontSize: isTablet()
            ? width * 0.02
            : Platform.OS === 'ios'
            ? width * 0.03
            : width * 0.03,
        }}>{`Version: ${currentVersion}`}</Text>
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
  // passcode
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    width: '80%',
  },
  passcodeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  passcodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  passcodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
  },
  passcodeInput: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    width: '20%',
    textAlign: 'center',
  },
  passcodeDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '40%',
  },
  passcodeDisplayDigit: {
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    textAlign: 'center',
  },
  passcodeDisplayFilled: {
    backgroundColor: 'gray',
    color: 'white',
  },
  pressed: {
    opacity: 0.65,
  },
  contactFontSize: {
    color: 'blue',
    fontSize: isTablet()
      ? width * 0.025
      : Platform.OS === 'ios'
      ? width * 0.03
      : width * 0.03,
  },
});

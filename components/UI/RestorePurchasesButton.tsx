import {
  ActivityIndicator,
  Alert,
  DevSettings,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import Purchases from 'react-native-purchases';
import {Auth} from 'aws-amplify';

type Props = {};

const RestorePurchasesButton = (props: Props) => {
  const [showBackupIndicator, setShowBackupIndicator] =
    useState<boolean>(false);

  const restorePurchases = async () => {
    setShowBackupIndicator(true);
    // TODO Restore user's transactions
    try {
      const restore = await Purchases.restorePurchases();
      // ... check restored customerInfo to see if entitlement is now active
      // Auth.signOut();
      // ios:  NativeModules.DevSettings.reload();??
      DevSettings.reload();
      // navigation.goBack();
    } catch (e) {
      Alert.alert(e.message);
    }
    setShowBackupIndicator(false);
  };

  return (
    <>
      <Pressable
        onPress={restorePurchases}
        style={({pressed}) => pressed && styles.pressed}>
        <Text style={styles.text}>Restore Purchases</Text>
      </Pressable>
      <ActivityIndicator
        size="small"
        color="#0000ff"
        animating={showBackupIndicator}
      />
    </>
  );
};

export default RestorePurchasesButton;

const styles = StyleSheet.create({
  // button: {
  //   marginTop: 'auto',
  // },
  text: {
    color: 'dodgerblue',
    fontFamily: 'ArialRoundedMTBold',
    alignSelf: 'center',
    fontSize: 18,
    paddingVertical: 16,
  },
  pressed: {
    opacity: 0.75,
    // backgroundColor: GlobalStyles.colors.primary100,
    // borderRadius: 4,
  },
});

import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Purchases from 'react-native-purchases';

type Props = {};

const RestorePurchasesButton = (props: Props) => {
  const restorePurchases = async () => {
    // TODO Restore user's transactions
    try {
      const restore = await Purchases.restorePurchases();
      // ... check restored customerInfo to see if entitlement is now active
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  return (
    <Pressable
      onPress={restorePurchases}
      style={({pressed}) => pressed && styles.pressed}>
      <Text style={styles.text}>Restore Purchases</Text>
    </Pressable>
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

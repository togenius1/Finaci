import {
  Alert,
  DevSettings,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
// import {useNavigation} from '@react-navigation/native';
import Purchases from 'react-native-purchases';

import {ENTITLEMENT_PRO, ENTITLEMENT_STD} from '../../constants/api';
import {Auth} from 'aws-amplify';

type Props = {};

const PackageItemsScreen = ({purchasePackage}: Props) => {
  const {
    product: {title, description, priceString},
  } = purchasePackage;

  const onSelection = async () => {
    // TODO purchase package
    try {
      const {customerInfo} = await Purchases.purchasePackage(purchasePackage);

      if (
        typeof customerInfo.entitlements.active[ENTITLEMENT_PRO] !==
          'undefined' ||
        typeof customerInfo.entitlements.active[ENTITLEMENT_STD] !== 'undefined'
      ) {
        // Unlock that great "pro" content
        Auth.signOut();
        // ios:  NativeModules.DevSettings.reload();??
        DevSettings.reload();
        // navigation.goBack();
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert(e);
      }
    }
  };

  // console.log('getUserData: ', getUserData);

  return (
    <Pressable onPress={onSelection} style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.terms}>{description}</Text>
      </View>
      <Text style={styles.title}>{priceString}</Text>
    </Pressable>
  );
};

export default PackageItemsScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginVertical: 10,
    backgroundColor: '#cdcdcd',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  left: {},
  title: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  terms: {
    color: '#545454',
  },
});

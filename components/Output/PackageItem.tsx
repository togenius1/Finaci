import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Purchases, {PurchasesPackage} from 'react-native-purchases';

import {ENTITLEMENT_PRO, ENTITLEMENT_STD} from '../../constants/api';
// import {Auth} from 'aws-amplify';

type Props = {
  stdActive: boolean;
  proActive: boolean;
  purchasePackage: PurchasesPackage;
  setPurchased: React.Dispatch<React.SetStateAction<boolean>>;
  reloadScreen: () => Promise<void>;
};

const PackageItem = ({
  purchasePackage,
  stdActive,
  proActive,
  setPurchased,
  reloadScreen,
}: Props) => {
  // const navigation = useNavigation<any>();

  const {
    product: {identifier, title, description, priceString},
  } = purchasePackage;

  const onSelection = async () => {
    if (
      (identifier === 'premium' && proActive === true) ||
      (identifier === 'remove_ads' && stdActive === true)
    ) {
      return;
    }
    // TODO purchase package
    try {
      const {customerInfo} = await Purchases.purchasePackage(purchasePackage);

      if (
        typeof customerInfo.entitlements.active[ENTITLEMENT_PRO] !==
          'undefined' ||
        typeof customerInfo.entitlements.active[ENTITLEMENT_STD] !== 'undefined'
      ) {
        // Unlock that great "pro" content
        // Auth.signOut();
        // ios:  NativeModules.DevSettings.reload();??
        // DevSettings.reload();
        await reloadScreen();
        setPurchased(true);
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert(e);
      }
    }
  };

  return (
    <Pressable
      onPress={onSelection}
      style={[
        styles.container,
        {
          backgroundColor:
            proActive === true
              ? '#52ff52'
              : identifier === 'remove_ads' && stdActive === true
              ? '#52ff52'
              : '#fdca65',
        },
      ]}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.terms}>{description}</Text>
      </View>
      <Text style={styles.title}>{priceString}</Text>
    </Pressable>
  );
};

export default PackageItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginVertical: 10,
    backgroundColor: '#fdca65',
    // borderBottomWidth: 1,
    // borderBottomColor: '#eaeaea',

    elevation: 4,
    shadowColor: '#c6c6c6',
    shadowOffset: {width: 5, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    borderRadius: 10,
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

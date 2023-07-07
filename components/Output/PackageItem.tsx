import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Purchases from 'react-native-purchases';
import {ENTITLEMENT_PRO} from '../../constants/api';

type Props = {};

const PackageItemsScreen = ({purchasePackage, setIsPurchasing}: Props) => {
  const {
    product: {title, description, priceString},
  } = purchasePackage;

  const navigation = useNavigation();

  // console.log('purchasePackage: ', purchasePackage);

  const onSelection = async () => {
    // TODO purchase package
    try {
      const {customerInfo} = await Purchases.purchasePackage(purchasePackage);

      if (
        typeof customerInfo.entitlements.active[ENTITLEMENT_PRO] !== 'undefined'
      ) {
        // Unlock that great "pro" content
        navigation.goBack();
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert(e);
      }
    }
  };

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

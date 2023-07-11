import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import TransactionSummary from '../Output/TransactionSummary';

const Screen1 = ({}: Props) => {
  return (
    <View style={styles.container}>
      <Text>Screen 1</Text>
      <TransactionSummary />
    </View>
  );
};

export default Screen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// ------------------------- TYPE ---------------------------------------
type Props = {};

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

type Props = {};

const Screen1 = (props: Props) => {
  return (
    <View
      style={{alignItems: 'center', justifyContent: 'center', marginTop: 100}}>
      <Text>Screen1</Text>
    </View>
  );
};

export default Screen1;

const styles = StyleSheet.create({});

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

type Props = {};

const Credits = (props: Props) => {
  return (
    <Text style={{position: 'absolute', bottom: 10, color: '#999999'}}>
      Created by zuperx Company.
    </Text>
  );
};

export default Credits;

// const styles = StyleSheet.create({});

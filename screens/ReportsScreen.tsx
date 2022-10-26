import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import Export from '../components/UI/Menu/Export';

type Props = {};

const ReportsScreen = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>ReportsScreen</Text>
      <Export />
    </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

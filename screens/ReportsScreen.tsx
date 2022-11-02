import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import Export from '../components/UI/Menu/Export';
import Backup from '../components/UI/Menu/Backup';
import Report from '../components/UI/Menu/Report';

type Props = {};

const ReportsScreen = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>ReportsScreen</Text>
      <Report />
      <Export />
      <Backup />
    </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import {StyleSheet, View} from 'react-native';
import React from 'react';

// import Report from '../components/Menu/Report';
import Export from '../components/Menu/Export';
// import Backup from '../components/Menu/Backup';

const ReportsScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Report /> */}
      <Export />
      {/* <Backup /> */}
    </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

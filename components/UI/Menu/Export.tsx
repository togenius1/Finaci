import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {EXPENSES} from '../../../dummy/dummy';
import {xport} from '../../../util/xport';

const Export = () => {
  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    setJsonData(EXPENSES);
  }, []);

  // Export data
  const exportHandler = data => {
    xport(data);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => {}}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
          Export <Text style={{fontSize: 12}}>(Raw data)</Text>
        </Text>
      </Pressable>

      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => exportHandler(jsonData)}>
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 18}}>Excel (.xls)</Text>
          <Text style={{fontSize: 14}}>
            Export your data via the .xls files
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default Export;

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginTop: 50,
  },
  exportsContainer: {
    marginLeft: 20,
    marginTop: 50,
  },
  pressed: {
    opacity: 0.75,
  },
});

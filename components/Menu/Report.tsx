import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('window');

const Report = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
          Report <Text style={{fontSize: 12}}>{`(coming soon...)`}</Text>
        </Text>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => {}}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18}}>PDF</Text>
            <Text style={{fontSize: 14}}>Create PDF reports</Text>
          </View>
        </Pressable>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => {}}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18}}>{`Excel (xls)`}</Text>
            <Text style={{fontSize: 14}}>Create .xls reports</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    width,
    height: 150,
    elevation: 3,
    shadowColor: '#c6c6c6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  inner: {
    marginLeft: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});

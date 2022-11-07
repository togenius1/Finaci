import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';



const Report = () => {
  return (
    <View style={styles.container}>
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
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginTop: 50,
  },
  pressed: {
    opacity: 0.75,
  },
});

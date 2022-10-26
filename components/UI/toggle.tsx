import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {};

const toggle = ({onPress, name, color, size, label, style}: Props) => {
  return (
    <View style={[styles.toggleContainer, style]}>
      <Pressable
        onPress={onPress}
        style={({pressed}) => pressed && styles.pressed}>
        <MaterialCommunityIcons name={name} size={size} color={color} />
      </Pressable>
      <Text style={{marginLeft: 6, fontWeight: 'bold'}}>{label}</Text>
    </View>
  );
};

export default toggle;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  onPress: () => void;
};

const {width, height} = Dimensions.get('window');

const AddAccountBtn = ({onPress, style}: Props) => {
  return (
    <View style={[styles.addButton, style]}>
      <Pressable
        onPress={onPress}
        style={({pressed}) => pressed && styles.pressed}>
        <View style={styles.icon}>
          <Ionicons name="add-circle" size={width * 0.15} color="#3683e2" />
        </View>
      </Pressable>
    </View>
  );
};

export default AddAccountBtn;

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: width * 0.8,
    marginTop: height * 0.77,
    marginBottom: 5,
    marginLeft: width * 0.15,
  },
  icon: {
    marginRight: 10,
    marginBottom: 15,
  },
  pressed: {
    opacity: 0.65,
  },
});

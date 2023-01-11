import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  onPress: () => void;
  icon: string;
  size: number;
  color: string;
};

const {width, height} = Dimensions.get('window');

const AddBtn = ({onPress, style, icon, size, color}: Props) => {
  return (
    <View style={[styles.addButton, style]}>
      <Pressable
        onPress={onPress}
        style={({pressed}) => pressed && styles.pressed}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name={icon} size={size} color={color} />
        </View>
      </Pressable>
    </View>
  );
};

export default AddBtn;

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: width * 0.8,
    // height: height * 0.8,
    marginTop: height * 0.77,
    marginBottom: 5,
    marginLeft: width * 0.15,

    position: 'absolute',
  },
  icon: {
    marginRight: 10,
    marginBottom: 15,
  },
  pressed: {
    opacity: 0.65,
  },
});

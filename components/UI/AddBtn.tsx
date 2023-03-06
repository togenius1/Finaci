import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  onPress: () => void;
  icon: string;
  size: number;
  color: string;
};

const {width, height} = Dimensions.get('window');

const AddBtn = ({onPress, style, icon, size, color}: Props) => {
  return (
    // <View style={[styles.addButton, style]}>
    <Pressable
      onPress={onPress}
      style={({pressed}) => pressed && styles.pressed}>
      <View style={[styles.icon, {backgroundColor: color}]}>
        {/* <MaterialCommunityIcons
          name={icon}
          size={size}
          color={color}
          style={styles.shadow}
          // type={'font-awesome'}
        /> */}
        <Text style={{fontSize: width * 0.08, color: '#ffffff'}}>+</Text>
      </View>
    </Pressable>
    // </View>
  );
};

export default AddBtn;

const WIDTH = width * 0.17;

const styles = StyleSheet.create({
  // addButton: {
  // flex: 1,
  // flexDirection: 'row',
  // justifyContent: 'flex-end',
  // alignItems: 'center',
  // marginTop: height * 0.77,
  // marginBottom: 20,
  // marginLeft: width / 1.5,
  // position: 'absolute',
  // },
  icon: {
    width: WIDTH,
    height: WIDTH,
    borderRadius: WIDTH / 2,

    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 45,
    right: 30,
    backgroundColor: '#ee7474', // Default background color

    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      width: -2, // These can't both be 0
      height: 3, // i.e. the shadow has to be offset in some way
    },
  },
  // },
  // shadow: {
  //   elevation: 1,
  //   // shadowColor: '#ffffff',
  //   shadowOpacity: 1,
  //   shadowRadius: 5,
  //   shadowOffset: {
  //     width: 1, // These can't both be 0
  //     height: 2, // i.e. the shadow has to be offset in some way
  //   },
  //   // textShadowRadius: 5,
  //   // textShadowOffset: {width: -2, height: 3},
  // },
  pressed: {
    opacity: 0.75,
  },
});

// ================================ Type =================================

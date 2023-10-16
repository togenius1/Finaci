import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

type Props = {
  text: string;
  onPress: () => void;
  type: string;
  bgColor: string;
  fgColor: string;
};

const CustomButton = ({
  text,
  onPress,
  type = 'PRIMARY',
  bgColor,
  fgColor,
}: Props) => {
  return (
    <Pressable
      style={({pressed}) =>
        pressed
          ? [
              styles.pressed,
              styles.container,
              styles[`container_${type}`],
              bgColor ? {backgroundColor: bgColor} : {},
            ]
          : [
              styles.container,
              styles[`container_${type}`],
              bgColor ? {backgroundColor: bgColor} : {},
            ]
      }
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? {color: fgColor} : {},
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },

  container_PRIMARY: {
    backgroundColor: '#1ec3ec',
  },

  container_SECONDARY: {
    borderColor: '#1ec3ec',
    borderWidth: 2,
  },

  container_TERTIARY: {},

  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },

  text_TERTIARY: {
    color: 'grey',
  },
  text_SECONDARY: {
    color: '#3B71F3',
  },

  pressed: {
    opacity: 0.75,
  },
});

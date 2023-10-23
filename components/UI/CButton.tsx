import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../../constants/styles';
import {isTablet} from 'react-native-device-info';

type Props = {
  children: React.ReactNode;
  // onPress: () => React.ReactNode;
};

const {width, height} = Dimensions.get('window');

const CButton = ({children, onPress, mode, style, styleBtn}: Props) => {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({pressed}) => pressed && styles.pressed}>
        <View style={[styles.button, mode === 'flat' && styles.flat, styleBtn]}>
          <Text style={[styles.buttonText, mode === 'flat' && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default CButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: isTablet()
      ? width * 0.02
      : Platform.OS === 'ios'
      ? width * 0.02
      : width * 0.02,
    paddingHorizontal: isTablet()
      ? width * 0.045
      : Platform.OS === 'ios'
      ? width * 0.035
      : width * 0.035,
    elevation: 8,
    // backgroundColor: '#d8edf2',
    backgroundColor: '#009688',
  },
  flat: {
    // backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: isTablet()
      ? width * 0.025
      : Platform.OS === 'ios'
      ? width * 0.025
      : width * 0.025,
  },
  flatText: {
    // color: GlobalStyles.colors.primary200,
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: GlobalStyles.colors.primary100,
    borderRadius: 4,
  },
});

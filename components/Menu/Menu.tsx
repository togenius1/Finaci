import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';

type Props = {
  monthlyClickedHandler: () => void;
  customClickedHandler: () => void;
  setIsMenuOpen: (value: boolean) => void;
  isMenuOpen: boolean;
  focusedTabIndex: number;
};

// Constant
const {width, height} = Dimensions.get('window');

const Menu = ({
  monthlyClickedHandler,
  customClickedHandler,
  isMenuOpen,
  setIsMenuOpen,
  focusedTabIndex,
}: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isMenuOpen}
      onDismiss={() => setIsMenuOpen(false)}
      onRequestClose={() => setIsMenuOpen(false)}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
        onPress={() => setIsMenuOpen(false)}>
        <View style={styles.listMenu}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => monthlyClickedHandler()}>
            <View
              style={{
                marginLeft: 20,
              }}>
              <Text>Monthly</Text>
            </View>
          </Pressable>

          {focusedTabIndex !== 0 && (
            <Pressable
              style={({pressed}) => pressed && styles.pressed}
              onPress={() => {
                customClickedHandler();
              }}>
              <View
                style={{
                  marginLeft: 20,
                }}>
                <Text>Custom</Text>
              </View>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

export default Menu;

const styles = StyleSheet.create({
  listMenu: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: width * 0.5,
    height: height * 0.155,
    borderWidth: 0.8,
    backgroundColor: '#ffffff',

    borderRadius: 5,
    borderColor: '#d4d4d4',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    position: 'absolute',
    top: 50,
    right: 0,
  },
  pressed: {
    opacity: 0.75,
  },
});

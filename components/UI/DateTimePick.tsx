import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Props = {};

const {width, height} = Dimensions.get('window');

const DateTimePick = ({
  isVisible,
  onChange,
  onCancel,
  onConfirm,
  value,
  mode,
  today,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={{position: 'absolute', bottom: 0}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={onCancel}>
            <Text>Cancel</Text>
          </Pressable>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={today}>
            <Text>Today</Text>
          </Pressable>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={onConfirm}>
            <Text>Done</Text>
          </Pressable>
        </View>
      </View>
      <DateTimePickerModal
        testID="dateTimePicker"
        isVisible={isVisible}
        value={value}
        mode={mode}
        is24Hour={true}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        onChange={onChange}
        onConfirm={onConfirm}
        onCancel={onCancel}
        style={styles.datePicker}
        // supportedOrientations="portrait-upside-down"
      />
    </View>
  );
};

export default DateTimePick;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnsContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  // Style for iOS ONLY...
  datePicker: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    height: height * 0.4,
    // display: 'flex',
    borderBottomWidth: 1,
    borderColor: '#ba4646',
  },

  pressed: {
    opacity: 0.55,
  },
});

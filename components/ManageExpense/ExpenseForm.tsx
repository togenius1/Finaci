import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

import {GlobalStyles} from '../../constants/styles';
import DateTimePick from '../UI/DateTimePick';

const {width} = Dimensions.get('window');

function ExpenseForm({
  type,
  amount,
  category,
  categoryTitle,
  note,
  accountTitle,
  account,
  textDate,
  setTextDate,
  setCategoryPressed,
  setNotePressed,
  setAccountPressed,
  initialDate,
}: Props) {
  const navigation = useNavigation();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [DATE, setDATE] = useState(initialDate);
  const [mode, setMode] = useState('datetime');

  useEffect(() => {
    setTextDate(initialDate);
  }, []);

  function onChange(event, selectedDate) {
    const currentDate = selectedDate || DATE;
    if (Platform.OS === 'android') {
      setDatePickerVisibility(true);
    }
    setDATE(currentDate);

    let fDate = moment(event).format('YYYY-MM-DD HH:mm:ss');
    setTextDate(fDate);
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  function hideDatePicker() {
    setDatePickerVisibility(false);
  }

  const handleConfirm = date => {
    setTextDate(moment(date).format('YYYY-MM-DD HH:mm:ss'));
    setDATE(date);
    hideDatePicker();
  };

  function onTodayHandler() {
    setDATE(new Date());
    setTextDate(moment().format('YYYY-MM-DD HH:mm:ss'));
  }

  function selectsCategoryHandler() {
    // navigation.navigate('Category');
    setCategoryPressed(true);
  }

  function pressedNoteHandler() {
    setNotePressed(true);
  }

  function PressedAccountHandler() {
    setAccountPressed(true);
  }

  // console.log('acc title: ', account?.title);

  return (
    <View style={styles.form}>
      <View style={styles.input}>
        <Pressable
          style={({pressed}) =>
            pressed ? [styles.pressed, styles.select] : styles.select
          }
          onPress={() =>
            navigation.navigate('AddExpenses', {
              amount: amount,
            })
          }>
          <View style={styles.textContainer}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: 'bold',
                color:
                  type === 'expense'
                    ? 'red'
                    : type === 'income'
                    ? 'green'
                    : 'blue',
              }}>
              {amount}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({pressed}) =>
            pressed ? [styles.pressed, styles.select] : styles.select
          }
          onPress={() => selectsCategoryHandler()}>
          <View style={styles.textContainer}>
            <Text style={{fontSize: 22}}>
              {category
                ? category.title
                : categoryTitle
                ? categoryTitle
                : 'Select Category'}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={({pressed}) =>
            pressed ? [styles.pressed, styles.select] : styles.select
          }
          onPress={() => pressedNoteHandler()}>
          <View style={styles.textContainer}>
            <Text style={{fontSize: 22}}>{note ? note : 'Take note'}</Text>
          </View>
        </Pressable>
        <Pressable
          style={({pressed}) =>
            pressed ? [styles.pressed, styles.select] : styles.select
          }
          onPress={showDatePicker}>
          <View style={styles.textContainer}>
            <Text style={{fontSize: 22}}>{textDate}</Text>
          </View>
        </Pressable>

        <Pressable
          style={({pressed}) =>
            pressed ? [styles.pressed, styles.select] : styles.select
          }
          onPress={() => PressedAccountHandler()}>
          <View style={styles.textContainer}>
            <Text style={{fontSize: 22}}>
              {account ? account?.title : accountTitle ? accountTitle : 'Cash'}
            </Text>
          </View>
        </Pressable>
      </View>

      <DateTimePick
        isVisible={isDatePickerVisible}
        onChange={onChange}
        onCancel={hideDatePicker}
        onConfirm={handleConfirm}
        value={DATE}
        mode={mode}
        today={onTodayHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 50,
  },
  input: {
    width: width * 0.9,
    height: 300,
    alignItems: 'flex-start',
    // backgroundColor: '#ebb2b2',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 5,
    marginBottom: 50,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: GlobalStyles.colors.primary500,
    margin: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    minWidth: 130,
    marginHorizontal: 20,
  },
  select: {
    width: '100%',
    marginBottom: 20,
  },
  textContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginBottom: 5,
  },
  pressed: {
    opacity: 0.65,
  },
});

export default ExpenseForm;

// ============================ TYPE =====================================
type Props = {
  type: string;
  amount: string;
  note: string;
  category: string;
  date: string;
  account: string;
  categoryTitle: string;
  accountTitle: string;
  textDate: string;
  initialDate: string;
  setTextDate: (value: string) => void;
  setCategoryPressed: (value: boolean) => void;
  setNotePressed: (value: boolean) => void;
  setAccountPressed: (value: boolean) => void;
};

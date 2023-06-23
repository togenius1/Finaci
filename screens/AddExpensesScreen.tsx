import React, {useEffect, useState} from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';

import Calculator from '../components/UI/Calculator';

// const colors = {
//   expense: 'red',
//   income: 'green',
//   transfer: 'blue',
// };

interface InitTransactionType {
  id: number;
  selected: boolean;
  type: string;
}

const transactionData = [
  {id: 1, type: 'expense', selected: true},
  {id: 2, type: 'income', selected: false},
  // {id: 3, type: 'transfer', selected: false},
];

const {width} = Dimensions.get('window');
const initTransaction = {id: 1, selected: true, type: 'expense'};

function Tab({item, onPress}) {
  let selectedColor;
  let fontWeight;
  if (item.id === 1) {
    selectedColor = item.selected ? '#f29393' : 'white';
    fontWeight = item.selected ? 'bold' : '';
  }
  if (item.id === 2) {
    selectedColor = item.selected ? '#90ed90' : 'white';
    fontWeight = item.selected ? 'bold' : '';
  }
  // if (item.id === 3) {
  //   selectedColor = item.selected ? '#8ddfff' : 'white';
  //   fontWeight = item.selected ? 'bold' : '';
  // }

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => pressed && styles.pressed}>
      <View style={[styles.transactionBox, {backgroundColor: selectedColor}]}>
        <Text style={[styles.tabText, {fontWeight: fontWeight}]}>
          {item.type}
        </Text>
      </View>
    </Pressable>
  );
}

function Tabs({data, handleOnPressHandler}) {
  return (
    <View style={styles.tabs}>
      <View style={{justifyContent: 'space-evenly', flexDirection: 'row'}}>
        {data?.map(item => {
          return (
            <Tab
              key={item.id}
              item={item}
              onPress={() => handleOnPressHandler(item)}
            />
          );
        })}
      </View>
    </View>
  );
}

const AddExpensesScreen = () => {
  const [transaction, setTransaction] =
    useState<InitTransactionType>(initTransaction);
  const [select, setSelect] = useState(transactionData);

  function handleOnPressHandler(item) {
    const newItem = select.map(val => {
      if (val.id === item.id) {
        return {...val, selected: !val.selected};
      } else {
        // return val; // Able to select all items
        return {...val, selected: false}; // Able to select only one item
      }
    });
    setSelect(newItem);
    setTransaction(item);
  }

  return (
    <View style={styles.container}>
      <Calculator nextScreen="AddDetails" transaction={transaction} />
      <Tabs data={select} handleOnPressHandler={handleOnPressHandler} />
    </View>
  );
};

export default AddExpensesScreen;

// Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    position: 'absolute',
    top: 20,
    width,
    // backgroundColor: '#ffadad',
  },
  tabText: {
    fontSize: 18,
  },
  transactionBox: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#e9e9e9',
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.65,
  },
});

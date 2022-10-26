import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

type Props = {};

const {width, height} = Dimensions.get('window');

const monthObj = [
  {id: 1, MY: 'Jan'},
  {id: 2, MY: 'Feb'},
  {id: 3, MY: 'Mar'},
  {id: 4, MY: 'Apr'},
  {id: 5, MY: 'May'},
  {id: 6, MY: 'June'},
  {id: 7, MY: 'July'},
  {id: 8, MY: 'Aug'},
  {id: 9, MY: 'Sep'},
  {id: 10, MY: 'Oct'},
  {id: 11, MY: 'Nov'},
  {id: 12, MY: 'Dec'},
];

let prevYear = Array.from({length: 5}, (_, i) =>
  eval('(' + `{id:${5 - i},MY:${moment().year() - i - 1}}` + ')'),
);
let nextYear = Array.from({length: 4}, (_, i) =>
  eval('(' + `{id:${i + 6},MY:${moment().year() + i}}` + ')'),
);
let yearObj = [...prevYear, ...nextYear];
//sort Data
yearObj.sort((a: any, b: any) => {
  const amountA = a.id;
  const amountB = b.id;
  if (amountA > amountB) {
    return -1; // return -1 here for AESC order
  }
  return 1; // return 1 here for DESC Order
});

function MonthList({item, onYearSelectedHandler}) {
  const currentYear = moment().year();
  const textColor = currentYear === item.MY ? '#02905e' : '';
  const textWeight = currentYear === item.MY ? '700' : '';

  return (
    <Pressable
      key={item}
      style={({pressed}) => pressed && styles.pressed}
      onPress={onYearSelectedHandler}>
      <View>
        <Text style={{fontSize: 16, fontWeight: textWeight, color: textColor}}>
          {item.MY}
        </Text>
      </View>
    </Pressable>
  );
}

export default function MonthYearList({
  monthlyPressed,
  onMonthYearSelectedHandler,
  year,
  setYear,
  decrementYearHandle,
  incrementYearHandle,
}: Props) {
  let obj;
  if (monthlyPressed) {
    obj = yearObj;
  } else {
    obj = monthObj;
  }

  function incrementYearHandle() {
    setYear(year => year + 1);
  }

  function decrementYearHandle() {
    setYear(year => year - 1);
  }

  return (
    <View style={styles.listMenu}>
      {!monthlyPressed && (
        <View
          style={{
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: '#d3d3d3',
            paddingVertical: 6,
            marginTop: -5,
            backgroundColor: '#94f5fa',
          }}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={decrementYearHandle}>
            <View style={{backgroundColor: '#e9a5a5', paddingHorizontal: 10}}>
              <Text style={{fontSize: 16}}>{`<`}</Text>
            </View>
          </Pressable>
          <View>
            <Text style={{fontSize: 16, fontWeight: '800'}}>{year}</Text>
          </View>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={incrementYearHandle}>
            <View style={{backgroundColor: '#e7a7a7', paddingHorizontal: 10}}>
              <Text style={{fontSize: 16}}>{`>`}</Text>
            </View>
          </Pressable>
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          // marginTop: -10,
          marginLeft: 15,
        }}>
        {obj.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                width: 85,
                marginHorizontal: 5,
                marginVertical: 10,
              }}>
              <MonthList
                item={item}
                onYearSelectedHandler={() =>
                  onMonthYearSelectedHandler(item?.MY)
                }
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listMenu: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: width * 0.8,
    height: 200,
    borderWidth: 0.8,
    borderRadius: 5,
    borderColor: '#d4d4d4',
    backgroundColor: '#ffffff',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    position: 'absolute',
    top: 5,
    right: 50,
  },
  pressed: {
    opacity: 0.65,
  },
});

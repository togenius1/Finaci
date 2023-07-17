import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import moment from 'moment';
// import {v4 as uuidv4} from 'uuid';

type Props = {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  year: number;
  setYear: (value: number) => void;
};

const {width, height} = Dimensions.get('window');

const monthObj = [
  {id: 0, MY: 'Jan'},
  {id: 1, MY: 'Feb'},
  {id: 2, MY: 'Mar'},
  {id: 3, MY: 'Apr'},
  {id: 4, MY: 'May'},
  {id: 5, MY: 'June'},
  {id: 6, MY: 'July'},
  {id: 7, MY: 'Aug'},
  {id: 8, MY: 'Sep'},
  {id: 9, MY: 'Oct'},
  {id: 10, MY: 'Nov'},
  {id: 11, MY: 'Dec'},
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

function MonthList({item, onYearSelectedHandler, selectedMY, monthlyPressed}) {
  // const currentYear = moment().year();
  let MY = item.MY;
  if (!monthlyPressed) {
    MY = +moment().month(item.MY).format('M');
  }

  const textColor = +selectedMY === +MY ? '#02905e' : '';
  const textWeight = +selectedMY === +MY ? '700' : '';

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
  onMYSelectedHandler,
  year,
  setYear,
  month,
  decrementYearHandle,
  incrementYearHandle,
  isModalVisible,
  setIsModalVisible,
}: Props) {
  //
  const selectedMY = monthlyPressed ? year : month;
  let obj;
  if (monthlyPressed) {
    obj = yearObj;
  } else {
    obj = monthObj;
  }

  function incrementYearHandle() {
    setYear(year => +year + 1);
  }

  function decrementYearHandle() {
    setYear(year => +year - 1);
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onDismiss={() => setIsModalVisible(false)}
      onRequestClose={() => setIsModalVisible(false)}>
      <Pressable
        style={styles.outSide}
        onPress={() => setIsModalVisible(false)}>
        <Pressable onPress={() => setIsModalVisible(true)}>
          <View style={styles.listMenu}>
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
                <View
                  style={{backgroundColor: '#e9a5a5', paddingHorizontal: 10}}>
                  <Text style={{fontSize: 16}}>{`<`}</Text>
                </View>
              </Pressable>
              <View>
                <Text style={{fontSize: 16, fontWeight: '800'}}>{year}</Text>
              </View>
              <Pressable
                style={({pressed}) => pressed && styles.pressed}
                onPress={incrementYearHandle}>
                <View
                  style={{backgroundColor: '#e7a7a7', paddingHorizontal: 10}}>
                  <Text style={{fontSize: 16}}>{`>`}</Text>
                </View>
              </Pressable>
            </View>

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
                      selectedMY={selectedMY}
                      monthlyPressed={monthlyPressed}
                      onYearSelectedHandler={
                        () => onMYSelectedHandler(item?.MY)
                        // && setIsModalVisible(false)
                      }
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  listMenu: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: width * 0.8,
    height: height * 0.3,
    borderWidth: 0.8,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderColor: '#d4d4d4',

    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    position: 'absolute',
    top: height * 0.06,
    right: 0,
  },
  outSide: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.65,
  },
});

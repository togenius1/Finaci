import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TransactContext from '../../store-context/transact-context';
import {TransactionNavigationProp} from '../../types';
// import {TransactionNavigationProp} from '../../types';

const {width, height} = Dimensions.get('window');

const HeaderRight = ({
  navigation,
  currentTabIndex,
  duration,
  year,
  showMonthYearListMenuHandler,
  onFromDateHandler,
  onToDateHandler,
}: Props) => {
  const transactCtx = useContext(TransactContext);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: width / 2,
        width: width * 0.5,
        marginTop: height * 0.032,
        // backgroundColor: '#fed8d8',
      }}>
      {/* {!transactCtx.customPressed && !transactCtx.exportPressed && ( */}
      {currentTabIndex !== 3 && currentTabIndex !== 4 && (
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => showMonthYearListMenuHandler()}>
          <View
            style={{
              marginRight: 25,
              // marginTop: 20,
              paddingHorizontal: 5,
              paddingVertical: 3.5,
              borderWidth: 0.6,
              borderColor: 'grey',
            }}>
            <Text>{`${duration} ${currentTabIndex !== 0 ? year : ''}`}</Text>
          </View>
        </Pressable>
      )}

      {/* {(transactCtx.customPressed || transactCtx.exportPressed) && ( */}
      {(currentTabIndex === 3 || currentTabIndex === 4) && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width * 0.5,
            marginRight: width / 8,
            // borderWidth: 0.6,
            // borderColor: 'lightgrey',
          }}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={onFromDateHandler}>
            <View style={{borderWidth: 0.6, borderColor: 'lightgrey'}}>
              <Text>{moment(transactCtx.fromDate).format('YYYY-MM-DD')}</Text>
            </View>
          </Pressable>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={onToDateHandler}>
            <View style={{borderWidth: 0.6, borderColor: 'lightgrey'}}>
              {/* <Text>2022-09-30</Text> */}
              <Text>{moment(transactCtx.toDate).format('YYYY-MM-DD')}</Text>
            </View>
          </Pressable>
        </View>
      )}

      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => navigation.navigate('Stats')}>
        <View style={{marginRight: 20}}>
          <Ionicons name="stats-chart-outline" size={20} color="#0047b8" />
        </View>
      </Pressable>
    </View>
  );
};

export default HeaderRight;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.65,
  },
});

// =========================== TYPE ======================================
type Props = {
  navigation: TransactionNavigationProp;
  currentTabIndex: number;
  duration: string | null;
  month: string;
  year: string;
  showMonthYearListMenuHandler: () => void;
  onFromDateHandler: () => void;
  onToDateHandler: () => void;
};

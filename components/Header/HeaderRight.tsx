import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TransactContext from '../../store-context/transact-context';
import {TransactionNavigationProp} from '../../types';
import {isTablet} from 'react-native-device-info';
// import {TransactionNavigationProp} from '../../types';

const {width, height} = Dimensions.get('window');

const HeaderRight = ({
  currentTabIndex,
  duration,
  year,
  showMonthYearListMenuHandler,
  onFromDateHandler,
  onToDateHandler,
}: Props) => {
  const transactCtx = useContext(TransactContext);

  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        // marginLeft: 10,
        // marginRight: 180,
        width: width * 0.5,
        // marginTop: height * 0.032,
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
            <Text style={styles.monthYearFontSize}>{`${duration} ${
              currentTabIndex !== 0 ? year : ''
            }`}</Text>
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
              <Text style={styles.monthYearFontSize}>
                {moment(transactCtx.fromDate).format('YYYY-MM-DD')}
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={onToDateHandler}>
            <View style={{borderWidth: 0.6, borderColor: 'lightgrey'}}>
              {/* <Text>2022-09-30</Text> */}
              <Text style={styles.monthYearFontSize}>
                {moment(transactCtx.toDate).format('YYYY-MM-DD')}
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => navigation.navigate('Stats')}>
        <View
          style={{
            marginRight: isTablet()
              ? width * 0.055
              : Platform.OS === 'ios'
              ? 35
              : -5,
          }}>
          <Ionicons
            name="stats-chart-outline"
            size={
              isTablet()
                ? width * 0.045
                : Platform.OS === 'ios'
                ? width * 0.05
                : width * 0.05
            }
            color="#0047b8"
          />
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
  monthYearFontSize: {
    fontSize: isTablet()
      ? width * 0.025
      : Platform.OS === 'ios'
      ? width * 0.03
      : width * 0.03,
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

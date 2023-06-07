import {
  StyleSheet,
  Dimensions,
  View,
  Pressable,
  Text,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {AccountNavigationType} from '../types';
import AccountComponents from '../components/Output/AccountComponents';
import MonthYearList from '../components/Menu/MonthYearList';

const {width, height} = Dimensions.get('window');
let MONTH = moment().month() + 1;
if (MONTH < 10) {
  MONTH = +`0${MONTH}`;
}
const initFromDateString = `${moment().year()}-${MONTH}-01`;
const initFromDate = moment(initFromDateString).format('YYYY-MM-DD');
const initToDate = moment().format('YYYY-MM-DD');

const HeaderRightComponent = ({
  setIsMenuOpen,
  setIsMYListVisible,
  year,
  month,
}: HeaderRightComponent) => {
  const monthLabel = moment.monthsShort(+month - 1);

  return (
    <View style={styles.headerRight}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => setIsMYListVisible(true)}>
        <View
          style={{
            // backgroundColor: '#ffd3d3',
            marginRight: 25,
          }}>
          <Text style={{fontSize: 16, color: '#2a8aff'}}>
            {monthLabel} {year}
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={setIsMenuOpen}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#ffd3d3',
            marginRight: 15,
          }}>
          <MaterialCommunityIcons
            name={'dots-vertical'}
            size={width * 0.06}
            color={'black'}
          />
        </View>
      </Pressable>
    </View>
  );
};

const AccountsScreen = ({navigation}: Props) => {
  const [IsAccFormVisible, setIsAccFormVisible] = useState<boolean>(false);
  const [isMYListVisible, setIsMYListVisible] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [year, setYear] = useState<number>(moment().year());
  const [month, setMonth] = useState<number>(MONTH);
  const [fromDate, setFromDate] = useState<string | null>(initFromDate);
  const [toDate, setToDate] = useState<string | null>(initToDate);

  useEffect(() => {
    onMonthYearSelectedHandler(moment().month());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'Accounts',
      headerTitleAlign: 'left',
      headerRight: () => (
        <HeaderRightComponent
          setIsMenuOpen={() => setIsMenuOpen(true)}
          setIsMYListVisible={setIsMYListVisible}
          year={year}
          month={month}
        />
      ),
    });
  }, [year, month]);

  // Set Month Year
  function onMonthYearSelectedHandler(time) {
    let fromdate;
    let todate;
    // let month;
    const mm = moment().month(time).format('MM');

    // const daysInMonth = moment(`YYYY-${mm}-DD`).daysInMonth();
    const daysInMonth = moment(
      moment().format(`${year}-${mm}`),
      'YYYY-MM',
    ).daysInMonth();
    fromdate = moment(`${year}-${mm}-01`).format('YYYY-MM-DD');
    todate = moment(`${year}-${mm}-${daysInMonth}`).format('YYYY-MM-DD');
    // month = moment(fromdate).month() + 1;

    setFromDate(moment(fromdate).format('YYYY-MM-DD'));
    setToDate(moment(todate).format('YYYY-MM-DD'));

    const MONTH = moment(todate).format('M');
    setMonth(MONTH);
    setIsMYListVisible(false);
  }

  const openAddAccountForm = () => {
    setIsAccFormVisible(true);
    setIsMenuOpen(false);
  };

  return (
    <View style={styles.container}>
      <AccountComponents
        navigation={navigation}
        IsAccFormVisible={IsAccFormVisible}
        setIsAccFormVisible={setIsAccFormVisible}
        month={month}
        year={year}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuOpen}
        onDismiss={() => setIsMenuOpen(false)}
        onRequestClose={() => setIsMenuOpen(false)}>
        <Pressable style={styles.outSide} onPress={() => setIsMenuOpen(false)}>
          <Pressable onPress={() => setIsMenuOpen(true)}>
            <View style={styles.menu}>
              <Pressable
                onPress={openAddAccountForm}
                style={({pressed}) => pressed && styles.pressed}>
                <View style={styles.addContainer}>
                  <Text style={styles.addText}>Add</Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <MonthYearList
        monthlyPressed={false}
        onMYSelectedHandler={onMonthYearSelectedHandler}
        year={+year}
        setYear={setYear}
        month={+month}
        setIsModalVisible={setIsMYListVisible}
        isModalVisible={isMYListVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: width * 0.45,
    height: height * 0.2,
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'black',

    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,

    position: 'absolute',
    right: 0,
    top: height / 16,
  },
  addContainer: {
    marginTop: 25,
    marginLeft: 15,
    // borderWidth: 0.25,
    // borderColor: 'grey',
  },
  addText: {
    fontSize: width * 0.045,
    fontWeight: '500',
    color: '#0362de',
  },
  outSide: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.65,
  },
});

export default AccountsScreen;

// =========================== TYPE ======================================
type Props = {
  navigation: AccountNavigationType;
};

type HeaderRightComponent = {
  setIsMenuOpen: (value: boolean) => boolean;
  setIsMYListVisible: (value: boolean) => boolean;
  year: number;
  month: number;
};

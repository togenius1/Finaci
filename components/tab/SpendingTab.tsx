import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import moment from 'moment';

// import {EXPENSES} from '../../dummy/dummy';
import BarchartTab from './BarChartTab';
// import IconButton from '../UI/iconButton';
// import {sumByCustomDate, sumByDate} from '../../util/math';
// import {SpendingTabRouteProp} from '../../types';
// import {ExpenseType} from '../../models/expense';
import {useAppSelector} from '../../hooks';
import OverviewContext from '../../store-context/overview-context';
// import {fetchExpensesData} from '../../store/expense-action';

type Props = {
  // focusedTabIndex: number;
};

// const {width} = Dimensions.get('window');

const SpendingTab = ({}: Props) => {
  // const navigation = useNavigation();

  // const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const expenseData = dataLoaded?.expenses?.expenses;
  // const [expenseData, setExpenseData] = useState<ExpenseType>();

  // const fromDate = route.params?.fromDate;
  // const toDate = route.params?.toDate;
  const overviewCtx = useContext(OverviewContext);
  const fromDate = overviewCtx?.fromDate;
  const toDate = overviewCtx?.toDate;

  // useEffect(() => {
  // setExpenseData(EXPENSES);
  // dispatch(fetchExpensesData());
  // }, []);

  // if (expenseData === null || expenseData === undefined) {
  //   return;
  // }
  // let filteredData;
  // if (focusedTabIndex === 0) {
  const filteredData = expenseData?.filter(
    d =>
      new Date(d.date) >= new Date(fromDate) &&
      new Date(d.date) <= new Date(toDate),
  );
  // }

  // const RenderBarchartTab = () => {
  //   return (
  //     <BarchartTab data={filteredData} fromDate={fromDate} toDate={toDate} />
  //   );
  // };

  return (
    <View style={styles.container}>
      <BarchartTab data={filteredData} fromDate={fromDate} toDate={toDate} />
    </View>
  );
};

export default SpendingTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // addButtonContainer: {
  //   backgroundColor: '#5ca3f6',
  //   width: width * 0.15,
  //   height: width * 0.15,
  //   borderRadius: (width * 0.2) / 2,
  //   borderWidth: 0.5,
  //   borderColor: '#fff',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   shadowOffset: {width: 0, height: 0},
  //   shadowOpacity: 0.7,
  //   shadowRadius: 3,
  //   elevation: 3,

  //   position: 'absolute',
  //   right: 20,
  //   bottom: 30,
  // },
  pressed: {
    opacity: 0.75,
  },
});

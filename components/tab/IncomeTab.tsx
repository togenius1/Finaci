// import {StyleSheet} from 'react-native';
import React, {useContext} from 'react';
// import {useIsFocused} from '@react-navigation/native';

import IncomeOutput from '../Output/IncomeOutput';
// import {INCOME} from '../../dummy/dummy';
// import {IncomeTabRouteProp} from '../../types';
// import {IncomeType} from '../../models/income';
import {useAppSelector} from '../../hooks';
// import {fetchIncomesData} from '../../store/income-action';
import OverviewContext from '../../store-context/overview-context';

type Props = {
  // focusedTabIndex: number;
};

const IncomeTab = ({}: Props) => {
  // const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const incomeData = dataLoaded?.incomes?.incomes;
  // const [incomeData, setIncomeData] = useState<IncomeType>();

  // const isFocused = useIsFocused();
  // const fromDate = route.params?.fromDate;
  // const toDate = route.params?.toDate;
  const overviewCtx = useContext(OverviewContext);
  const fromDate = overviewCtx?.fromDate;
  const toDate = overviewCtx?.toDate;

  // useEffect(() => {}, [route.params]);

  // useEffect(() => {
  // setIncomeData(INCOME);
  // dispatch(fetchIncomesData());
  // }, []);

  if (incomeData === null || incomeData === undefined) {
    return;
  }

  return (
    // isFocused && (
    <IncomeOutput data={incomeData} fromDate={fromDate} toDate={toDate} />
    // )
  );
};

export default IncomeTab;

// const styles = StyleSheet.create({});

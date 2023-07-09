import AsyncStorage from '@react-native-async-storage/async-storage';

import {accountActions} from './account-slice';

export const fetchAuthAccountsData = () => {
  return async dispatch => {
    const fetchData = async () => {
      //   const response = await AsyncStorage.getItem('root');
      // const response = DailyTractions;
      await AsyncStorage.removeItem('root');
      const response = null;

      // return response !== null ? JSON.stringify(response) : null;
      return response !== null ? response : null;
    };

    try {
      const authAccountsData = await fetchData();
      dispatch(
        accountActions.replaceAccount({
          authAccounts: authAccountsData || [],
        }),
      );
    } catch (error) {}
  };
};

/* Redux-persist will automatically retrieve data from AsyncStorage 
 ,so don't have to do the same as Amplify*/

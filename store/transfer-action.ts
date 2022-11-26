import AsyncStorage from '@react-native-async-storage/async-storage';

import {TRANSFER} from '../dummy/transfer';
import {transferActions} from './transfer-slice';

export const fetchTransferData = () => {
  return async dispatch => {
    const fetchData = async () => {
      //   const response = await AsyncStorage.getItem('root');
      const response = TRANSFER;

      // return response !== null ? JSON.stringify(response) : null;
      return response !== null ? response : null;
    };

    try {
      const TransferData = await fetchData();
      dispatch(
        transferActions.replaceTransfer({
          transfer: TransferData || [],
        }),
      );
    } catch (error) {}
  };
};

/* Redux-persist will automatically retrieve data from AsyncStorage 
 ,so don't have to do the same as Amplify*/

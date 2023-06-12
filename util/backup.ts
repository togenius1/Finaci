import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

import {decryption} from './decryption';

// Save data to local storage
export const saveDataToStorage = async obj => {
  try {
    await AsyncStorage.setItem('expense1', JSON.stringify(obj));
  } catch (err) {
    console.log('Error: ', err);
  }
};

//GET data from DB
export const getJsonObject = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('expense1');
    // console.log(jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    // console.log('Effor: ', err);
  }
};

// SET data to Local DB
export const restoreDataHandler = async () => {
  const pickedFile = await handleDocumentSelection();

  const uri = pickedFile?.uri;
  const data = await RNFS.readFile(uri, 'base64')
    .then(result => {
      // console.log('result: ', result);
      return result;
    })
    .catch(err => {
      console.log(err.message, err.code);
    });
  // console.log('encrypted: ', data);
  const decrypted = await decryption(data);
  // console.log('decrypted: ', decrypted);
  return data;
};

// Select file from Storage
export const handleDocumentSelection = async () => {
  try {
    const response = await DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen',
    });
    // console.log('response: ', response);
    return response;
  } catch (err) {
    console.warn(err);
  }
};

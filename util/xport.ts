import {Alert} from 'react-native';
import {writeFile} from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';

// Export
export const xport = data => {
  var ws = XLSX.utils.json_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Expense');

  const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
  var RNFS = require('react-native-fs');
  var file = RNFS.DocumentDirectoryPath + '/Export.xlsx';
  writeFile(file, wbout, 'ascii')
    .then(() => {
      // console.log('FILE WRITTEN!\n' + file);
      customShare(file);
    })
    .catch(err => {
      Alert.alert(err.message);
    });
};

export const customShare = async (url: string) => {
  const shareOptions = {
    url: `file://${url}`,
  };
  await Share.open(shareOptions);
};

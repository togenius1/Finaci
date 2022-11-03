import {writeFile} from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';

export const xport = data => {
  const d = new Date();
  const mm = d.getMonth() + 1;
  let dd = d.getDate();
  const yy = d.getFullYear();
  const time = d.getTime();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  const fileName = `Finner_reports_${dd}${mm}${yy}`;

  var ws = XLSX.utils.json_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');

  const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
  var RNFS = require('react-native-fs');
  var file = RNFS.DocumentDirectoryPath + `/${fileName}.xlsx`;
  writeFile(file, wbout, 'ascii')
    .then(r => {
      console.log('FILE WRITTEN!\n' + file);
      customShare(file);
    })
    .catch(err => {
      Alert.alert(err.message);
    });
};

const customShare = async url => {
  console.log(url);
  const shareOptions = {
    url: `file://${url}`,
  };

  try {
    const ShareResponse = await Share.open(shareOptions);
    console.log(ShareResponse);
  } catch (error) {
    console.log('Error ==>', error);
  }
};

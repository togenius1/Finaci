import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import {prefetchConfiguration} from 'react-native-app-auth';
import RNFS from 'react-native-fs';

import {EXPENSES} from '../../../dummy/dummy';
import {xport} from '../../../util/xport';
import {configs, defaultAuthState} from '../../../util/authConfig';
import {authorization, refreshAuthorize} from '../../../util/auth';
import {
  fetchCreateFile,
  fetchCreateFolder,
  fetchFindFolder,
} from '../../../util/fetchData';
import {decryption} from '../../../util/decrypt';
import {encryption} from '../../../util/encrypt';

interface AuthStateType {
  hasLoggedInOnce: boolean;
  provider: string;
  accessToken: string;
  accessTokenExpirationDate: string;
  refreshToken: string;
}

// Constant
const sec_1 = 1000;
const minute_1 = sec_1 * 60;
const minute_5 = minute_1 * 5;
const minute_15 = minute_5 * 3;
const hour = minute_15 * 4;
const day = hour * 24;
const SevenDays = day * 7;
const month = day * 30;

const Export = () => {
  const timerRef = useRef<number>(0);
  const [authState, setAuthState] = useState<AuthStateType>(defaultAuthState);
  const auth = useRef<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    setJsonData(EXPENSES);
  }, []);

  useEffect(() => {
    prefetchConfiguration({
      warmAndPrefetchChrome: true,
      connectionTimeoutSeconds: 5,
      ...configs.auth0,
    });
  }, []);

  useEffect(() => {
    authHandler();
  }, [authState]);

  const authHandler = () => {
    const accessToken = authState?.accessToken;
    const authh = `Bearer ${accessToken}`;
    auth.current = authh;
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      console.log('timer running');
    }, SevenDays);
    () => clearInterval(timerRef.current);
  }, []);

  const handleAuthorize = useCallback(
    async provider => {
      await authorization(provider, setAuthState);
    },
    [authState],
  );

  const handleRefresh = useCallback(async () => {
    await refreshAuthorize(authState, setAuthState);
  }, [authState]);

  // Export data
  const exportHandler = data => {
    xport(data);
  };

  // Backup
  const backupHandler = async data => {
    // const db = await getJsonObject();
    const db = data;
    const encryptedData = await encryption(db);

    const d = new Date();
    const mm = d.getMonth() + 1;
    let dd = d.getDate();
    const yy = d.getFullYear();
    const time = d.getTime();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    const fileName = `finner-${dd}${mm}${yy}${time}.bak`;
    console.log(encryptedData);

    const today = new Date();
    const expireAccessToken = new Date(authState.accessTokenExpirationDate);
    if (!authState.hasLoggedInOnce || today === expireAccessToken) {
      await handleAuthorize('auth0');
    } else {
      await handleRefresh();
    }
    await findFolderAndInsertFile(encryptedData);
  };

  // Create folder
  async function createFolder() {
    const folderObj = await fetchCreateFolder(auth.current, jsonData);
    return folderObj;
  }

  // Find Folder in the google drive.
  async function FindFolderInGoogleDrive() {
    setIsLoading(true);
    const folders = await fetchFindFolder(auth.current);
    setIsLoading(false);
    return folders;
  }

  // Fin any folders in the local storage.
  async function findFolderAndInsertFile(obj) {
    console.log('Find Folder and Insert FIle');
    let folderId: string | null;
    folderId = await AsyncStorage.getItem('@folderbackup_key');
    const folderInDrive = await FindFolderInGoogleDrive();

    const foundFolderId = folderInDrive.files?.find(
      fd => fd.id === folderId,
    )?.id;

    if (folderId === null || foundFolderId === undefined) {
      const folderObj = await createFolder();
      await AsyncStorage.setItem('@folderbackup_key', folderObj?.id);
    } else {
      await fetchCreateFile(auth.current, obj, folderId);
    }
  }

  // SET data to Local DB
  const restoreHandler = async () => {
    const pickedFile = await handleDocumentSelection();

    const uri = pickedFile?.uri;
    const encryptedData = await RNFS.readFile(uri, 'base64')
      .then(result => {
        console.log('result: ', result);
        return result;
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
    console.log('picked data: ', encryptedData);
    const decrypted = await decryption(encryptedData);
    console.log('decrypted: ', decrypted);
    return decrypted;
  };

  // Select file from Storage
  const handleDocumentSelection = async () => {
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

  /**
   Add Icons
   Rearrange Icons to 3 x 3
   */

  return (
    <View style={styles.container}>
      <View style={styles.reportsContainer}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
          Report <Text style={{fontSize: 12}}>{`(coming soon...)`}</Text>
        </Text>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => {}}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18}}>PDF</Text>
            <Text style={{fontSize: 14}}>Create PDF reports</Text>
          </View>
        </Pressable>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => {}}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18}}>{`Excel (xls)`}</Text>
            <Text style={{fontSize: 14}}>Create .xls reports</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.exportsContainer}>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => {}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
            Export <Text style={{fontSize: 12}}>(Raw data)</Text>
          </Text>
        </Pressable>

        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => exportHandler(jsonData)}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18}}>Excel (.xls)</Text>
            <Text style={{fontSize: 14}}>
              Export your data via the .xls files
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.exportsContainer}>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => {}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
            Backup <Text style={{fontSize: 12}}>(google drive)</Text>
          </Text>
        </Pressable>

        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => backupHandler(jsonData)}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18}}>Backup</Text>
            <Text style={{fontSize: 14}}>Backup your data to cloud</Text>
          </View>
        </Pressable>

        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => restoreHandler()}>
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18}}>Restore</Text>
            <Text style={{fontSize: 14}}>Restore your data from cloud</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Export;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
  },
  reportsContainer: {
    marginLeft: 20,
    marginTop: 50,
  },
  exportsContainer: {
    marginLeft: 20,
    marginTop: 50,
  },
  pressed: {
    opacity: 0.75,
  },
});

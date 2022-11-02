import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {prefetchConfiguration} from 'react-native-app-auth';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

import {generateKeyPair, PRIVATE_KEY, PUBLIC_KEY} from '../../../util/crypto';
import {configs, defaultAuthState} from '../../../util/authConfig';
import {decryption} from '../../../util/decrypt';
import {encryption} from '../../../util/encrypt';
import {EXPENSES} from '../../../dummy/dummy';
import {
  fetchCreateFile,
  fetchCreateFolder,
  fetchFindFolder,
} from '../../../util/fetchData';
import {authorization, refreshAuthorize} from '../../../util/auth';

type Props = {};

interface AuthStateType {
  hasLoggedInOnce: boolean;
  provider: string;
  accessToken: string;
  accessTokenExpirationDate: string;
  refreshToken: string;
}

const sec_1 = 1000;
const minute_1 = sec_1 * 60;
const minute_5 = minute_1 * 5;
const minute_15 = minute_5 * 3;
const hour = minute_15 * 4;
const day = hour * 24;
const SevenDays = day * 7;
const month = day * 30;

const Backup = (props: Props) => {
  const [authState, setAuthState] = useState<AuthStateType>(defaultAuthState);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const auth = useRef<string | null>('');
  const timerRef = useRef<number>(0);
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
    timerRef.current = setInterval(() => {
      console.log('timer running');
    }, SevenDays);
    () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    authHandler();
  }, [authState]);

  const authHandler = () => {
    const accessToken = authState?.accessToken;
    const authh = `Bearer ${accessToken}`;
    auth.current = authh;
  };

  const handleAuthorize = useCallback(
    async provider => {
      await authorization(provider, setAuthState);
    },
    [authState],
  );

  const handleRefresh = useCallback(async () => {
    await refreshAuthorize(authState, setAuthState);
  }, [authState]);

  // Backup
  const backupHandler = async (obj: {}) => {
    const encrypted = await encryption(obj);

    const d = new Date();
    const mm = d.getMonth() + 1;
    let dd = d.getDate();
    const yy = d.getFullYear();
    const time = d.getTime();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    const fileName = `finner-${dd}${mm}${yy}${time}.bak`;

    const today = new Date();
    const expireAccessToken = new Date(authState.accessTokenExpirationDate);
    if (!authState.hasLoggedInOnce || today === expireAccessToken) {
      await handleAuthorize('auth0');
    } else {
      await handleRefresh();
    }
    await findFolderAndInsertFile(encrypted, fileName);
  };

  // Restore data from google drive
  const restoreHandler = async () => {
    const pickedFile = await handleDocumentSelection();

    const uri = pickedFile?.uri;
    const encryptedData = await RNFS.readFile(uri, 'ascii')
      .then(result => {
        return result;
      })
      .catch(err => {
        console.log(err.message, err.code);
      });

    const decrypted = await decryption(String(encryptedData));
    console.log('decrypted: ', decrypted);
    return decrypted;
  };

  // Generate PRIVATE_KEY to Cloud
  const updateKeyPair = async () => {
    const {publicKey} = generateKeyPair();
    const privateK = await AsyncStorage.getItem(PRIVATE_KEY);
    // save private key to Async storage
    console.log('privateK: ', privateK);
    if (privateK === null || privateK === undefined) {
      const {secretKey} = generateKeyPair();
      await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
    }
    await AsyncStorage.setItem(PUBLIC_KEY, publicKey.toString());
  };

  // Create folder
  async function createFolder(fileName: string) {
    const folderObj = await fetchCreateFolder(auth.current, jsonData, fileName);
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
  async function findFolderAndInsertFile(obj, fileName: string) {
    let folderId: string | null;
    folderId = await AsyncStorage.getItem('@folderbackup_key');
    const folderInDrive = await FindFolderInGoogleDrive();

    const foundFolderId = folderInDrive.files?.find(
      fd => fd.id === folderId,
    )?.id;

    if (folderId === null || foundFolderId === undefined) {
      const folderObj = await createFolder(fileName);
      await AsyncStorage.setItem('@folderbackup_key', folderObj?.id);
    } else {
      await fetchCreateFile(auth.current, obj, folderId, fileName);
    }
  }

  // Select file from Storage
  const handleDocumentSelection = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
      });
      console.log('response: ', response);
      return response;
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
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

      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={updateKeyPair}>
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 18}}>updateKeyPair</Text>
          <Text style={{fontSize: 14}}>update key pair</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default Backup;

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginTop: 50,
  },
  pressed: {
    opacity: 0.75,
  },
});

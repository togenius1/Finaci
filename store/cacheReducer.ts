import AsyncStorage from '@react-native-async-storage/async-storage';

import {createReducer} from '@reduxjs/toolkit';
import {clearStorageCache} from './cacheActions';

const initialState = {
  // Your initial cache state here
};

const cacheReducer = createReducer(initialState, builder => {
  builder.addCase(clearStorageCache, (state, action) => {
    // Clear your storage cache here
    // For example, using AsyncStorage.clear() from '@react-native-async-storage/async-storage'
    AsyncStorage.clear();
  });
});

export default cacheReducer;

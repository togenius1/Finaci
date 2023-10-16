import {createSlice} from '@reduxjs/toolkit';

const passcodeSlice = createSlice({
  name: 'passcode',
  initialState: {
    isSet: false,
    value: '',
  },
  reducers: {
    setPasscode: (state, action) => {
      state.isSet = true;
      state.value = action.payload;
    },
    updatePasscode: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {setPasscode, updatePasscode} = passcodeSlice.actions;

export default passcodeSlice;

////////////////////////////////////////////////////////////////

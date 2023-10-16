import {Alert} from 'react-native';
import {authorize, refresh} from 'react-native-app-auth';

import {configs} from '../constants/authConfig';

// First Authorization
export const authorization = async (provider, setAuthState) => {
  try {
    const config = configs[provider];
    const newAuthState = await authorize({
      ...config,
      connectionTimeoutSeconds: 15,
    });

    setAuthState({
      hasLoggedInOnce: true,
      provider: provider,
      ...newAuthState,
    });
  } catch (error) {
    Alert.alert('Failed to log in', error.message);
  }
};

// Refresh Access Token
export const refreshAuthorize = async (authState, setAuthState) => {
  try {
    const config = configs[authState.provider];
    const newAuthState = await refresh(config, {
      refreshToken: authState.refreshToken,
    });

    setAuthState(current => ({
      ...current,
      ...newAuthState,
      refreshToken: newAuthState.refreshToken || current.refreshToken,
    }));
  } catch (error) {
    Alert.alert('Failed to refresh token', error.message);
  }
};

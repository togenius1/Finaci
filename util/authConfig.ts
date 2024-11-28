import {Platform} from 'react-native';

// Android FingerPrint
// From Mac: ........
// From Lenove: ......

const clientId =
  Platform.OS === 'ios'
    ? '.......'
    : '.......';

const redirectUrl =
  Platform.OS === 'ios'
    ? 'org.reactjs.native.example.Finner:/oauth2redirect/google'
    : 'com.finner:/oauth2redirect/google';

export const configs = {
  auth0: {
    issuer: 'https://accounts.google.com',
    clientId: clientId,
    redirectUrl: redirectUrl,
    additionalParameters: {},
    scopes: [
      'openid',
      'profile',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.appdata',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
      'https://www.googleapis.com/auth/drive.metadata',
      'https://www.googleapis.com/auth/drive.photos.readonly',
    ],
  },
};

export const defaultAuthState = {
  hasLoggedInOnce: false,
  provider: '',
  accessToken: '',
  accessTokenExpirationDate: '',
  refreshToken: '',
};

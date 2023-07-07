import {Platform} from 'react-native';

// Android FingerPrint
// From Mac mini: 51:D2:25:43:33:30:02:AC:D6:AA:23:5F:47:F3:29:38:27:30:D6:76
// From Lenove: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25

const clientId =
  Platform.OS === 'ios'
    ? '532601104816-l9qg5p1m1hfcthih1gvhrq4av7nil22t.apps.googleusercontent.com'
    : '532601104816-26amjvgj3agnpqqm69f1mvcr8rpuk0ot.apps.googleusercontent.com';

const redirectUrl =
  Platform.OS === 'ios'
    ? 'org.reactjs.native.togenius1.finner:/oauth2redirect/google'
    : 'com.togenius1.finner:/oauth2redirect/google';

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

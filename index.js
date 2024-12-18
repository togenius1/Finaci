import '@azure/core-asynciterator-polyfill';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import App from './App';
import {name as appName} from './app.json';
import {store, persistor} from './store';

// Should be removed after React-Native-Reanimated to be updated.
// LogBox.ignoreLogs(['RCTBridge required dispatch_sync to load REAModule']);

const Root = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);

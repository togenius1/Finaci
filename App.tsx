import {ActivityIndicator, StatusBar, View} from 'react-native';
import React from 'react';
import {Amplify, Auth, Hub} from 'aws-amplify';

import {setPRNG} from 'tweetnacl';

import awsconfig from './src/aws-exports';
import {PRNG} from './util/crypto';
import FinnerNavigator from './navigation/FinnerNavigator';

Amplify.configure(awsconfig);

setPRNG(PRNG);

const App = () => {
  const [authenticatedUser, setAuthenticatedUser] =
    React.useState<Object | null>({});
  // const dispatch = useAppDispatch();
  // // const dataLoaded = useAppSelector(store => store);

  // useEffect(() => {
  //   dispatch(fetchExpensesData());
  // }, []);

  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      setAuthenticatedUser(authUser);
    } catch (e) {
      setAuthenticatedUser(null);
    }
  };

  React.useEffect(() => {
    checkUser();
  }, []);

  React.useEffect(() => {
    const listener = data => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut') {
        checkUser();
      }
    };
    Hub.listen('auth', listener);
    return () => Hub.remove('auth', listener);
  }, []);

  if (authenticatedUser === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <FinnerNavigator authenticatedUser={authenticatedUser} />
    </>
  );
};

export default App;

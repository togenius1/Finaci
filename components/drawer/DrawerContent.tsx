import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Auth, Hub} from 'aws-amplify';

type Props = {};

const colors = {
  overview: '#2790db',
  stats: '#db2775',
  expense: '#992103',
  income: '#03991e',
  budget: '#072ac7',
  setting: '#424242',
  paywall: '#eb9d3d',
  user: '#075aff',
  recommendation: '#00c4da',
};

const {width, height} = Dimensions.get('window');

const DrawerContent = ({props}: Props) => {
  const navigation = useNavigation();

  const [authUser, setAuthUser] = useState<any>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Listening for Login events.
  useEffect(() => {
    const listenerAuth = async data => {
      if (data.payload.event === 'signIn') {
        setIsAuthenticated(true);
      }
      if (data.payload.event === 'signOut') {
        setIsAuthenticated(false);
      }
    };

    Hub.listen('auth', listenerAuth);
  }, []);

  // Check if authenticated user, Stay logged in.
  useEffect(() => {
    const onAuthUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      setAuthUser(authUser);
      setIsAuthenticated(true);
    };

    onAuthUser();
  }, []);

  const accountAuthHandler = () => {
    navigation.navigate('User');
  };

  const signHandler = async () => {
    await Auth.signOut();
    setIsAuthenticated(false);
    navigation.navigate('User');
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <View style={styles.OverviewContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Overview');
            }}>
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons
                name="chart-donut-variant"
                size={width * 0.065}
                color={colors.overview}
              />
              <Text style={styles.overviewText}>Overview</Text>
            </View>
          </Pressable>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Transactions');
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 20,
                marginBottom: 20,
              }}>
              <Ionicons
                name="remove-outline"
                size={width * 0.065}
                color={colors.expense}
              />
              <Text style={styles.expenseText}>Transactions</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.expenseIncomeContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Stats');
            }}>
            <View style={{flexDirection: 'row', marginBottom: height / 50}}>
              <Ionicons
                name="bar-chart-outline"
                size={width * 0.065}
                color={colors.stats}
              />
              <Text style={styles.overviewText}>Stats</Text>
            </View>
          </Pressable>

          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Accounts');
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
                marginBottom: 20,
              }}>
              <Ionicons
                name="wallet-outline"
                size={width * 0.065}
                color={colors.budget}
              />
              <Text style={styles.budgetText}>Accounts</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.reportContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Reports');
            }}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="newspaper-outline"
                size={width * 0.065}
                color={colors.budget}
              />
              <Text style={styles.reportText}>Export</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.reportContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Backup');
            }}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="cloud-upload-outline"
                size={width * 0.065}
                color={colors.budget}
              />
              <Text style={styles.reportText}>Backup/Restore</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.packageContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => accountAuthHandler()}>
            <View style={styles.user}>
              <MaterialCommunityIcons
                name="account-outline"
                size={width * 0.07}
                color={colors.paywall}
              />
              <Text style={styles.settingText}>User account</Text>
            </View>
          </Pressable>
        </View>

        {/* <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Recommend');
            }}>
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons
                name="thumb-up"
                size={22}
                color={colors.recommendation}
              />
              <Text style={styles.RecommendText}>Recommend</Text>
            </View>
          </Pressable> */}

        <View style={styles.settingContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Settings');
            }}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="cog-outline"
                size={width * 0.065}
                color={colors.setting}
              />
              <Text style={styles.settingText}>Settings</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.logoutContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => signHandler()}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="log-out"
                size={width * 0.065}
                color={colors.user}
              />
              <Text style={styles.logoutText}>
                {isAuthenticated ? 'Sign out' : 'Sign in'}
              </Text>
              <Text style={styles.username}>
                {isAuthenticated ? authUser?.username : ''}
              </Text>
            </View>
          </Pressable>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: 'white',
  },
  OverviewContainer: {
    // flex: 1,
    marginTop: 20,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#c2c2c2',
    // backgroundColor: '#c8edc8',
  },
  overviewText: {
    fontSize: 16,
    marginLeft: 20,
  },
  expenseIncomeContainer: {
    // flex: 1,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#c2c2c2',
    marginTop: 20,
    // backgroundColor: '#f78888',
  },
  expenseText: {
    fontSize: 14,
    marginLeft: 20,
    color: colors.expense,
  },
  incomeText: {
    fontSize: 14,
    marginLeft: 20,
    color: colors.income,
  },
  budgetText: {
    fontSize: 14,
    marginLeft: 20,
    color: colors.budget,
  },
  reportContainer: {
    // paddingVertical: 200,
    marginTop: 30,
    marginLeft: 20,
    // marginBottom: 100,
    // borderBottomWidth: 1,
    // borderBottomColor: '#c2c2c2',
    // backgroundColor: '#86dd89',
  },
  reportText: {
    fontSize: 14,
    marginLeft: 20,
  },

  packageContainer: {
    marginLeft: 20,
    marginTop: height / 15,
  },
  user: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: height / 50,
  },
  settingContainer: {
    marginLeft: 20,
    marginTop: height / 5.5,
    // marginBottom: 10,
    // backgroundColor: '#86b0dd',
  },

  settingText: {
    fontSize: 14,
    marginLeft: 20,
  },
  RecommendText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  logoutContainer: {
    marginLeft: 20,
    marginTop: Platform.OS === 'ios' ? 10 : height * 0.09,
    // bottom: Platform.OS === 'ios' ? 10 : 0,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  username: {
    color: 'grey',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});

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
import {Auth} from 'aws-amplify';

type Props = {};

const colors = {
  overview: '#2790db',
  stats: '#db2775',
  expense: '#992103',
  income: '#03991e',
  budget: '#072ac7',
  setting: '#424242',
  user: '#075aff',
  recommendation: '#00c4da',
};

const {width, height} = Dimensions.get('window');

const DrawerContent = (props: Props) => {
  const navigation = useNavigation();

  const [authUser, setAuthUser] = useState<any>();

  useEffect(() => {
    const onAuthUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      setAuthUser(authUser);
    };

    onAuthUser();
  }, []);

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <View style={styles.OverviewContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Overview');
            }}>
            <View style={{flexDirection: 'row', marginBottom: height / 50}}>
              <MaterialCommunityIcons
                name="chart-donut-variant"
                size={24}
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
            <View style={{flexDirection: 'row', marginBottom: height / 50}}>
              <Ionicons
                name="remove-outline"
                size={22}
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
                size={24}
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
            <View style={{flexDirection: 'row', marginBottom: height / 50}}>
              <Ionicons name="wallet-outline" size={22} color={colors.budget} />
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
                size={22}
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
                size={22}
                color={colors.budget}
              />
              <Text style={styles.reportText}>Backup/Restore</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.packageContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Paywall');
            }}>
            <View style={{flexDirection: 'row', marginBottom: height / 50}}>
              <MaterialCommunityIcons
                name="shape-plus-outline"
                size={22}
                color={colors.setting}
              />
              <Text style={styles.settingText}>Paywall</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.settingContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Settings');
            }}>
            <View style={{flexDirection: 'row', marginBottom: height / 50}}>
              <Ionicons name="cog-outline" size={22} color={colors.setting} />
              <Text style={styles.settingText}>Settings</Text>
            </View>
          </Pressable>

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
        </View>

        <View style={styles.logoutContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => Auth.signOut()}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons name="log-out" size={22} color={colors.user} />
              <Text style={styles.logoutText}>Log out</Text>
              <Text style={styles.username}>{authUser?.username}</Text>
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
    marginTop: 25,
    backgroundColor: 'white',
  },
  OverviewContainer: {
    // flex: 1,
    marginTop: 40,
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
    marginTop: 50,
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

  settingContainer: {
    marginLeft: 20,
    marginTop: height / 5,
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
    marginTop: Platform.OS === 'ios' ? 10 : 30,
    bottom: Platform.OS === 'ios' ? 10 : 0,
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

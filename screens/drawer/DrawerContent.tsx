import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
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
};

const {width, height} = Dimensions.get('window');

const DrawerContent = (props: Props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <View style={styles.OverviewContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Overview');
            }}>
            <View style={{flexDirection: 'row', marginBottom: 25}}>
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
            <View style={{flexDirection: 'row', marginBottom: 25}}>
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
            <View style={{flexDirection: 'row', marginBottom: 25}}>
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
            <View style={{flexDirection: 'row', marginBottom: 25}}>
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
              <Text style={styles.reportText}>Report & Export</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.settingContainer}>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Settings');
            }}>
            <View style={{flexDirection: 'row', marginBottom: 25}}>
              <Ionicons name="cog-outline" size={22} color={colors.setting} />
              <Text style={styles.settingText}>Settings</Text>
            </View>
          </Pressable>

          {/* <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate('Profile');
            }}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons name="happy-outline" size={22} color={colors.user} />
              <Text style={styles.profile}>Nunggu</Text>
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
  settingContainer: {
    marginLeft: 20,
    marginTop: 180,
    // marginBottom: 100,
    // backgroundColor: '#86b0dd',
  },
  settingText: {
    fontSize: 14,
    marginLeft: 20,
  },
  profile: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  logoutContainer: {
    marginLeft: 20,
    marginTop: 50,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});

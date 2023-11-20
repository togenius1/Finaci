import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CButton from '../components/UI/CButton';

type Props = {};

const {width, height} = Dimensions.get('window');

const RecommendScreen = (props: Props) => {
  const sendCodeHandler = () => {
  //  console.log('send link download to friend')
  };

  const onCopyCode = () => {
    // console.log('copy code');
  };

  return (
    <View style={styles.container}>
      <View style={styles.pointsContainer}>
        <Text style={styles.points}>
          0{'\n'}
          <Text style={styles.point}>point</Text>
        </Text>
      </View>

      <View style={styles.topExplainContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Refer your friend and unlock premium features
        </Text>
      </View>

      <View style={styles.explainContainer}>
        <Text style={{fontSize: 16}}>
          Recommend your friend to download and the points to unlock Finaci's
          premium features
        </Text>
      </View>

      <View style={styles.codeBoxContainer}>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>Code: </Text>
          <Pressable
            style={({pressed}) => pressed && styles.pressed}
            onPress={onCopyCode}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.code}>256d54a4</Text>
              <View style={{marginLeft: 50}}>
                <MaterialCommunityIcons
                  name="content-copy"
                  size={24}
                  color={'lightgrey'}
                />
              </View>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <CButton
          onPress={sendCodeHandler}
          style={{marginTop: 25, width: width * 0.5}}>
          Send code to friends
        </CButton>
      </View>

      <View style={styles.redeemContainer}>
        <Text style={styles.redeemText}>Redeem points</Text>
      </View>

      <View style={styles.featuresR1Container}>
        <View style={styles.featureContainer}>
          <MaterialCommunityIcons
            name="microsoft-excel"
            size={28}
            color={'grey'}
          />
          <Text style={styles.featuresText}>Export to Excel</Text>
          <MaterialCommunityIcons
            name="lock-outline" // lock-open-variant-outline
            size={20}
            color={'grey'}
          />
        </View>
        <View style={styles.featureContainer}>
          <MaterialCommunityIcons
            name="database-arrow-down"
            size={28}
            color={'grey'}
          />
          <Text style={styles.featuresText}>Backup</Text>
          <MaterialCommunityIcons
            name="lock-outline" // lock-open-variant-outline
            size={20}
            color={'grey'}
          />
        </View>
      </View>

      <View style={styles.featuresR2Container}>
        <View style={styles.featureContainer}>
          <MaterialCommunityIcons name="infinity" size={28} color={'grey'} />
          <Text style={styles.featuresText}>Unlimited Accounts</Text>
          <MaterialCommunityIcons
            name="lock-outline" // lock-open-variant-outline
            size={20}
            color={'grey'}
          />
        </View>

        <View style={[styles.featureContainer, {marginLeft: 55}]}>
          {/* <MaterialCommunityIcons
            name="database-arrow-down"
            size={28}
            color={'grey'}
          />
          <Text style={styles.featuresText}>Unlimited Accounts</Text>
          <MaterialCommunityIcons
            name="lock-outline" // lock-open-variant-outline
            size={20}
            color={'grey'}
          /> */}
        </View>
      </View>
    </View>
  );
};

export default RecommendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9',
  },
  pointsContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  points: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  point: {
    fontSize: 12,
    color: '#464646',
  },
  topExplainContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  explainContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  codeBoxContainer: {
    alignItems: 'center',
  },
  codeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: width * 0.9,
    height: height * 0.05,
    backgroundColor: 'white',
  },
  codeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
    marginRight: 15,
  },
  code: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  redeemContainer: {
    marginLeft: 10,
    marginBottom: 20,
  },
  redeemText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  featuresR1Container: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  featuresR2Container: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  featureContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  featuresText: {
    fontSize: 14,
    marginTop: 8,
  },
  pressed: {
    opacity: 0.65,
  },
});

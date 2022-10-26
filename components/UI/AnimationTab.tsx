import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

type Props = {
  translateYValue: Animated.Value;
  yPos: number;
  headerLabel: string;
  styleContainer: object;
  styleHeaderContainer: any;
  styleHeaderText: any;
  onPressTab(): void;
};

const {width, height} = Dimensions.get('window');

let pages = 2;

const AnimationTab = ({
  translateYValue,
  yPos,
  onPressTab,
  onPressItem,
  DATA,
  headerLabel,
  styleContainer,
  styleHeaderContainer,
  styleHeaderText,
}: Props) => {
  // const [state, set_state] = useState({status: 'idle', data: []});
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(false);
  const [measures, setMeasures] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await DATA;

      if (response !== null) {
        setData(response);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [DATA]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  // Create column for FlatList base on 3 x 3.
  const DATALENGTH = data?.length;
  pages = Math.ceil(DATALENGTH / 9);
  const numColumns = pages * 3;

  // Create fake index pages for creating pagination dots.
  let pagesArr = Array.from(Array(pages).keys());

  const Indicator = ({scrollX}) => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'absolute',
          bottom: -25,
        }}>
        {pagesArr.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.4, 1],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 0.9, 0.7],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={`indicator-${i}`}
              style={{
                height: 6,
                width: 6,
                borderRadius: 3,
                backgroundColor: '#686868',
                margin: 10,
                opacity,
                transform: [
                  {
                    scale,
                  },
                ],
              }}
            />
          );
        })}
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: width / 3,
          marginVertical: 5,
        }}>
        <Pressable
          onPress={() => onPressItem(item)}
          style={({pressed}) => pressed && styles.pressed}>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              color: '#272727',
              marginRight: 15,
            }}>
            {item.title}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View>
      <Animated.View
        style={[
          {
            transform: [
              {
                translateY: translateYValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, yPos],
                }),
              },
            ],
          },
        ]}>
        <View>
          <View style={[styles.container, styleContainer]}>
            <Pressable
              onPress={onPressTab}
              style={({pressed}) => pressed && styles.pressed}>
              <View style={[styles.headerContainer, styleHeaderContainer]}>
                <Text style={[styles.headerText, styleHeaderText]}>
                  {headerLabel}
                </Text>
              </View>
            </Pressable>
            <View
              style={{
                width,
                height: 150,
                marginTop: 10,
                // backgroundColor: '#93caa4',
              }}>
              <ScrollView
                scrollEventThrottle={16}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {x: scrollX}}}],
                  {useNativeDriver: false},
                )}>
                <FlatList
                  keyExtractor={item => item.title + Math.random()}
                  data={data}
                  renderItem={renderItem}
                  numColumns={numColumns}
                  scrollEnabled={false}
                />
              </ScrollView>
              <Indicator scrollX={scrollX} />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const headerHeight = 30;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#e4e4e4',

    position: 'absolute',
    top: -height / 8,
  },
  headerContainer: {
    justifyContent: 'center',
    backgroundColor: 'green',
    height: headerHeight,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  pressed: {
    opacity: 0.55,
  },
});

export default AnimationTab;

import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

type Props = {
  TabsDataObject: object;
  onItemPress: () => void;
  indicatorIndex: number;
};

interface IndicatorType {
  measures: any[];
  indicatorIndex: number | undefined;
}

const {width} = Dimensions.get('window');

const Tab = React.forwardRef(({item, onItemPress}, ref) => {
  return (
    <Pressable
      style={({pressed}) => pressed && styles.pressed}
      onPress={onItemPress}>
      <View ref={ref}>
        <Text style={{fontSize: 14, fontWeight: '600'}}>{item}</Text>
      </View>
    </Pressable>
  );
});

const Indicator = ({measures, indicatorIndex}: IndicatorType) => {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        height: 2.5,
        marginLeft: 6.5,
        width: measures[indicatorIndex].width,
        left: measures[indicatorIndex].x,
        backgroundColor: '#ed7575',
        bottom: 0,
      }}
    />
  );
};

const Tabs = ({TabsDataObject, onItemPress, indicatorIndex}: Props) => {
  const [measures, setMeasures] = useState();
  const containerRef = useRef();

  const data = Object.keys(TabsDataObject).map(i => ({
    key: i,
    title: i,
    // value: TabsDataObject[i],
    ref: createRef(),
  }));

  useEffect(() => {
    const m = [];
    data.forEach(item => {
      item?.ref?.current?.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({
            x,
            y,
            width,
            height,
          });
          if (m.length === data.length) {
            setMeasures(m);
          }
        },
      );
    });
  }, [data]);

  return (
    <View style={styles.tabContainer}>
      <View ref={containerRef} style={styles.itemContainer}>
        {data?.map((item, index) => {
          return (
            <Tab
              key={item.key}
              item={item.title.toUpperCase()}
              onItemPress={() => onItemPress(index)}
              ref={item.ref}
            />
          );
        })}
      </View>
      {measures?.length > 0 && (
        <Indicator measures={measures} indicatorIndex={indicatorIndex} />
      )}
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  tabContainer: {
    padding: 6,
    marginTop: 10,
    width,
    // backgroundColor: '#c2fae2',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pressed: {
    opacity: 0.75,
  },
});

import {Dimensions, StyleSheet, Text, View, Alert, Platform} from 'react-native';
import React from 'react';
// import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Svg, {Path, G, Text as SvgText, Polyline, Line} from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import {scaleLinear} from 'd3-scale';
import {max, min} from 'd3-array';

// import {ExpenseCategory} from '../../../dummy/categoryItems';

type Props = {
  data: any[];
};

const {width, height} = Dimensions.get('window');
const radius = width * 0.15;

const makePie = (data, type) => {
  const filteredData = data.map(data => data.percentage);
  const arcs = d3Shape.pie()(filteredData);
  let colorRange;
  if (type === 'expense') {
    colorRange = ['#ffff00', '#8fdb8a', '#ffa500', '#cb0404'];
  }
  if (type === 'income') {
    colorRange = ['#ffff00', '#ffa500', '#8fdb8a', '#008000'];
  }

  // Scale linear color
  const maxValue = max(filteredData);
  const minValue = min(filteredData);
  const gradientScale = scaleLinear()
    .domain([minValue, maxValue / 4, maxValue / 2, maxValue])
    .range(colorRange);

  return arcs.map((arc, index) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .innerRadius(0)
      .outerRadius(radius);

    const outerArcForLabelsPosition = d3Shape
      .arc()
      .innerRadius(radius * 0.95)
      .outerRadius(radius * 0.95);

    return {
      path: instance(arc),
      color: gradientScale(arc.value),
      value: data,
      centroid: instance.centroid(arc),
      radius: radius,
      startAngle: arc.startAngle,
      endAngle: arc.endAngle,
      outerArcForLabelsPosition: outerArcForLabelsPosition,
    };
  });
};

const PieChart = ({data, type}: Props) => {
  if (data === null || data === undefined) {
    return;
  }

  if (data.length === 0) {
    data = [
      {
        amount: 100,
        id: 'empty',
        percentage: 1,
        title: 'No Expenses',
      },
    ];
  }

  // Get Pie Path
  const _piePaths = makePie(data, type);

  const _renderSvgPie = () => {
    //
    return (
      <View style={styles.container}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${width}`}>
          <G y={width / 2} x={width / 2}>
            {_piePaths.map((arc, i) => {
              const [x, y] = arc.centroid;

              const amount = arc.value[i].amount;
              const posA = arc.outerArcForLabelsPosition.centroid(arc);
              const posB = arc.outerArcForLabelsPosition.centroid(arc);
              const posC = arc.outerArcForLabelsPosition.centroid(arc);
              const midAngle =
                arc.startAngle + (arc.endAngle - arc.startAngle) / 2;
              if (arc.value[i].percentage > 0.1) {
                posB[0] = arc.radius * 0.45 * (midAngle < Math.PI ? 1 : -1);
              }
              const cx = posC[0] * 2.5;
              const cy = posC[1] * 2;

              return (
                <G
                  key={`arc-${i}`}
                  onPress={() => Alert.alert(amount.toString())}>
                  <Path d={arc.path} fill={arc.color} opacity={0.9} />
                  {/* <SvgText
                    x={x}
                    y={y}
                    fill="#1c1b1b"
                    textAnchor="middle"
                    fontSize={9}>
                    {amount}
                  </SvgText> */}

                  <Polyline
                    points={`${posA} ${posB} ${cx},${cy}`}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth="1"
                  />
                </G>
              );
            })}
          </G>
        </Svg>
        {_piePaths.map((arc, i) => {
          const label = arc.value[i].title;
          const pct = arc.value[i].percentage * 100;
          const posC = arc.outerArcForLabelsPosition.centroid(arc);
          const cx = posC[0] * 2.8;
          const cy = Platform.OS === 'ios' ? posC[1] * 2.0 : posC[1] * 2.4;

          return (
            <View
              key={`labelBox-${i}`}
              style={{
                width: 100,
                height: 35,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                // backgroundColor: '#ecbebe',
                transform: [
                  {
                    translateX: cx,
                  },
                  {
                    translateY: cy,
                  },
                ],
              }}>
              <Text style={{fontSize: 10, color: '#000000'}}>{label}</Text>
              <Text style={{fontSize: 10, color: '#000000'}}>
                {pct.toFixed(0)}%
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return <_renderSvgPie />;
};

export default PieChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 10,
  },
});

import React, {useRef, useState} from 'react';
import {Dimensions, PanResponder, StyleSheet, View} from 'react-native';
import {Svg, G, Line, Rect, Text as SvgText} from 'react-native-svg';
// import * as d3 from 'd3';
import {scaleLinear, scaleTime} from 'd3-scale';
import {max} from 'd3-array';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

type Props = {
  //   data: BarChart;
  round: number | undefined;
  unit: string | null;
  barWidth: number | undefined;
  graph_marginY: number | undefined;
};

const {width, height} = Dimensions.get('window');

const colors = {
  axis: '#0a0a0a',
  bars: '#7f7575',
  today: '#1bb400',
  maxValueCol: 'red',
  tabProgress: 'rgba(98, 218, 100, 0.55)',
};

const BarChart = ({data, round, unit}: Props) => {
  const [positionX, setPositionX] = useState(-1);

  const daysInSelectedMonth = moment(data[0]?.date).daysInMonth();
  const startDate = moment(new Date(data[0]?.date)).format('DD MMM');
  const endDate = moment(new Date(data[data.length - 1]?.date)).format(
    'DD MMM',
  );
  let dayLeft;
  let today;
  if (moment(new Date(data[0]?.date)).month() === moment().month()) {
    today = moment().format('DD MMM');
    dayLeft = moment().date() + 1;
  } else {
    today = '';
    dayLeft = daysInSelectedMonth;
  }

  const maxValue = max(data, d => parseFloat(d.amount));
  // const dateOfMax = data.filter(d => parseFloat(d.amount) === maxValue);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gesture) => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gesture) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderMove: (evt, gesture) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderRelease: () => {
        setPositionX(-1);
      },
    }),
  ).current;

  // Dimensions
  const barWidth = 6.5;
  const graph_marginY = 155;
  const graph_marginX = 15;
  const graphWidth = width - graph_marginX * 2;
  const daysInMonth = moment().daysInMonth();
  const gm = graphWidth / daysInMonth - barWidth;

  // X SCALE
  const xDomain = [1, daysInMonth];
  const xRange = [0, width * 0.85];
  const timeRamp = scaleTime().domain(xDomain).range(xRange);

  // Y scale linear
  const yDomain = [0, maxValue];
  const yRange = [0, 110];
  const yScale = scaleLinear().domain(yDomain).range(yRange);
  // const yScale = scaleLinear().domain([0, maxValue]).range([0, 110]);

  // BOX SCALE
  const thisDay = moment().date();
  const curGraphWidth = barWidth * thisDay + gm * (thisDay - 1);
  const domain = [graph_marginX / 2, curGraphWidth];
  const range = [1, thisDay];
  const xScale = scaleLinear().domain(domain).range(range);

  // update Position of Tooltips Line
  const updatePosition = x => {
    let value = x;
    if (x - graphWidth >= -1) {
      value = -1; // Out of chart range, automatic correction
    }
    setPositionX(value);
  };

  // Tooltips
  const Tooltip = x => {
    if (positionX < 0) {
      return null;
    }
    const boxWidth = 100;
    const boxHeight = 45;
    const boxMarginY = yScale(-25);
    const amountMargin = boxHeight - boxHeight / 2;
    const dateMargin = boxHeight - boxHeight / 8;
    const textMarginX = 20;

    let pos = parseInt(xScale(positionX));
    let amount = 0;
    if (pos < thisDay) {
      amount = data[pos]?.amount;
    } else {
      pos = thisDay - 1;
      amount = 0;
    }

    return (
      <G x={positionX} key="tooltip">
        <G
          x={positionX > graph_marginX + barWidth + 10 ? -50 : 1}
          y={boxMarginY}>
          <Rect
            y={0}
            rx={12} // borderRadius
            ry={12} // borderRadius
            width={boxWidth}
            height={boxHeight}
            stroke="rgba(254, 190, 24, 0.27)"
            fill="rgba(249, 244, 216, 0.65)"
          />

          <SvgText x={textMarginX} y={dateMargin} fill="#000000" fontSize={10}>
            {moment(data[pos]?.date).format('YYYY-MM-DD')}
          </SvgText>

          <SvgText
            x={textMarginX}
            y={amountMargin}
            fontSize={10}
            fontWeight="bold"
            fill="rgba(0, 0, 0, 1)">
            ${amount}
          </SvgText>
        </G>
        <G x={x}>
          <Line
            y1={180}
            y2={yScale(110)}
            stroke="#fa0000"
            strokeWidth={1}
            strokeDasharray={[6, 3]}
          />
        </G>
      </G>
    );
  };

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          height: 200,
          marginHorizontal: graph_marginX,
          // backgroundColor: '#e8ffe0'
        },
      ]}
      {...panResponder.panHandlers}>
      <Svg height="100%" width="100%">
        <G>
          {/* BAR Chart */}
          {data.map((item, index) => (
            <Rect
              key={`bar-${uuidv4()}`}
              width={barWidth}
              height={yScale(parseFloat(item.amount))}
              x={timeRamp(new Date(item.date).getDate())}
              y={graph_marginY - yScale(parseFloat(item.amount))}
              fill={
                new Date(item.date).getDate() === moment().date() &&
                today !== ''
                  ? colors.today
                  : parseFloat(item.amount) === maxValue
                  ? colors.maxValueCol
                  : colors.bars
              }
            />
          ))}
          {/* Day Left */}
          <Rect
            width={timeRamp(daysInSelectedMonth)}
            height={yScale(maxValue) * 1.25}
            fill="black"
            x={timeRamp(dayLeft)}
            y={graph_marginY - yScale(maxValue) * 1.1}
            fill={colors.tabProgress}
            opacity={0.9}
          />
          {/* Current day Line */}
          {today !== '' && (
            <Rect
              width={1}
              height={yScale(maxValue) * 1.3}
              fill="black"
              x={timeRamp(moment().date() + 0.25)}
              y={graph_marginY - yScale(maxValue) * 1.1}
            />
          )}
          {/* today */}
          <SvgText
            key={'label' + uuidv4()}
            fontSize="10"
            fontWeight="bold"
            fill="#00a210"
            x={timeRamp(
              moment().date() === 1 ? moment().date() + 0.5 : moment().date(),
            )}
            y={graph_marginY + 40}
            textAnchor="middle">
            {today}
          </SvgText>
          {/* start date */}
          <SvgText
            key={'label' + Math.random() * 1}
            fontSize="10"
            fill="#2a2828"
            x={20}
            y={graph_marginY + 30}
            textAnchor="middle">
            {startDate}
          </SvgText>
          {/* end date */}
          <SvgText
            key={'label' + Math.random() * 1}
            fontSize="10"
            fill="#2a2828"
            x={timeRamp(moment().daysInMonth()) - 9}
            y={graph_marginY + 30}
            textAnchor="middle">
            {endDate}
          </SvgText>
        </G>
        <Tooltip />
      </Svg>
    </View>
  );
};

export default BarChart;

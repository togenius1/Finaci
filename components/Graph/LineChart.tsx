import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Svg, {
  G,
  Line,
  Circle,
  Text as SvgText,
  Path,
  Rect,
} from 'react-native-svg';
import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');
// const AnimatedSvg = Animated.createAnimatedComponent(Svg);
// const AnimatedLine = Animated.createAnimatedComponent(Line);
// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);
// const AnimatedPath = Animated.createAnimatedComponent(Path);

// Margin
const marginXFromLeft = 50;
const marginYFromBottom = 50;
const paddingFromScreenBorder = 20;

const LineChart = ({
  type,
  lineChartData = [],
  containerHeight = width / 1.35,
  circleColor = 'red',
  circleRadius = 3,
  axisColor = '#000000',
  axisWidth = 1,
  gridColor = 'grey',
  gridWidth = 0.25,
  axisLabelFontSize = 10,
  lineChartColor = 'red',
  lineChartWidth = 1,
}: Props) => {
  const [yAxisLabels, setYAxisLabels] = useState([]);
  const [positionX, setPositionX] = useState(-1);
  const [positionY, setPositionY] = useState(-1);

  useEffect(() => {
    const yAxisData = lineChartData?.map((item, index) => {
      if (index === 0) {
        return yMinValue.toFixed(0);
      } else {
        return (yMinValue + gapBetweenYAxisValues * index).toFixed(0);
      }
    });
    setYAxisLabels(yAxisData);
  }, []);

  // X-AXIS Point
  const xAxisX1Point = marginXFromLeft;
  const xAxisY1Point = containerHeight - marginYFromBottom;
  const xAxisX2Point = width - paddingFromScreenBorder;
  const xAxisY2Point = containerHeight - marginYFromBottom;
  const xAxisActualWidth = width - marginXFromLeft - paddingFromScreenBorder;
  const gapBetweenXAxisAndTicks = xAxisActualWidth / lineChartData?.length;

  // Y-AXIS Point
  const yAxisX1Point = marginXFromLeft;
  const yAxisY1Point = paddingFromScreenBorder;
  const yAxisX2Point = marginXFromLeft;
  const yAxisY2Point = containerHeight - marginYFromBottom;

  // Y-AXIS PARAMS
  const yMinValue = 0;

  const yMaxValue = Math.max.apply(
    Math,
    lineChartData?.map(item =>
      type === 'expense' ? item?.expense_monthly : item?.income_monthly,
    ),
  );

  const div = +lineChartData?.length - 2 > 0 ? +lineChartData?.length - 2 : 1;
  const gapBetweenYAxisValues = (yMaxValue - yMinValue) / div;
  const yAxisActualHeight = yAxisY2Point - yAxisY1Point;
  const gapBetweenYAxisAndTicks =
    (yAxisActualHeight - yMinValue) / +lineChartData?.length;

  // X SCALE
  const thisMonth = moment().month() + 1;
  const xWidth = gapBetweenXAxisAndTicks * thisMonth + gapBetweenXAxisAndTicks;
  const domain = [marginXFromLeft + paddingFromScreenBorder, xWidth];
  const range = [1, thisMonth];
  const xScale = scaleLinear().domain(domain).range(range);

  // Update Position of Tooltips Line
  const updatePosition = position => {
    const graphWidth = width;
    let valueX = position?.x;
    let valueY = position?.y;
    if (position?.x - graphWidth >= -1) {
      valueX = -1; // Out of chart range, automatic correction
    }
    setPositionX(valueX);
    setPositionY(valueY);
  };

  // Tooltips
  const Tooltip = () => {
    const boxWidth = 100;
    const boxHeight = 45;
    const boxMarginY = positionY - boxHeight - 5;
    const amountMargin = boxHeight - boxHeight / 2;
    const dateMargin = boxHeight - boxHeight / 8;
    const textMarginX = marginXFromLeft / 2;
    // const marginXFromRight = xWidth - paddingFromScreenBorder;

    let pos = parseInt(xScale(positionX)) - 1;
    let amount = 0;
    if (pos < thisMonth) {
      amount =
        type === 'expense'
          ? lineChartData[pos]?.expense_monthly?.toFixed(2)
          : lineChartData[pos]?.income_monthly?.toFixed(2);
    } else {
      pos = thisMonth - 1;
      amount = 0;
    }

    let posXBox;
    if (positionX < marginXFromLeft) {
      posXBox = 1;
    }
    if (positionX > marginXFromLeft && amount === 0) {
      posXBox = -50;
    }
    if (positionX > marginXFromLeft && amount > 0) {
      posXBox = -100;
    }

    const monthLabel = moment.monthsShort(pos) + ' ' + moment().year();

    return (
      <G x={positionX} key="tooltip">
        <G x={posXBox} y={boxMarginY}>
          <Rect
            y={0}
            rx={12} // borderRadius
            ry={12} // borderRadius
            width={boxWidth}
            height={boxHeight}
            stroke="rgba(254, 190, 24, 0.27)"
            fill="rgba(249, 244, 216, 0.55)"
          />
          <SvgText x={textMarginX} y={dateMargin} fill="#000000" fontSize={10}>
            {monthLabel}
          </SvgText>

          <SvgText
            x={textMarginX}
            y={amountMargin}
            fontSize={10}
            fontWeight="bold"
            fill="rgba(0, 0, 0, 1)">
            {amount}
          </SvgText>
        </G>
      </G>
    );
  };

  const renderXYAxis = () => {
    return (
      <G key="x-axis y-axis">
        <Line
          key="x-axis"
          x1={xAxisX1Point}
          y1={xAxisY1Point}
          x2={xAxisX2Point}
          y2={xAxisY2Point}
          stroke={axisColor}
          strokeWidth={axisWidth}
        />
        <Line
          key="y-axis"
          x1={yAxisX1Point}
          y1={yAxisY1Point}
          x2={yAxisX2Point}
          y2={yAxisY2Point}
          stroke={axisColor}
          strokeWidth={axisWidth}
        />
      </G>
    );
  };

  const renderXAxisLabelsAndTicks = () => {
    return lineChartData?.map((item, index) => {
      let xPoint = xAxisX1Point + gapBetweenXAxisAndTicks * (index + 1);

      const monthLabel = moment.monthsShort(item.month - 1);

      return (
        <G key={`x-axis labels and ticks${index}`}>
          <Line
            key={`x-axis-tick${index}`}
            x1={xPoint}
            y1={xAxisY1Point}
            x2={xPoint}
            y2={xAxisY1Point + 5}
            strokeWidth={axisWidth}
            stroke={axisColor}
          />
          <SvgText
            key={`x-axis-label${index}`}
            x={xPoint}
            y={xAxisY1Point + 20}
            fill={axisColor}
            fontWeight="400"
            fontSize={axisLabelFontSize}
            textAnchor="middle">
            {monthLabel}
          </SvgText>
        </G>
      );
    });
  };

  const renderYAxisLabelsAndTicks = () => {
    return yAxisLabels?.map((item, index) => {
      let yPoint = yAxisY2Point - gapBetweenYAxisAndTicks * index;
      const maxValue = max(yAxisLabels, (d, i) => parseFloat(yAxisLabels[i])); // Check if no data
      if (maxValue === 0) {
        yPoint = yAxisY2Point / 2;
      }

      return (
        <G key={`y-axis labels and ticks${index}`}>
          <Line
            key={`y-axis grid${index}`}
            x1={xAxisX1Point}
            y1={yPoint}
            x2={xAxisX2Point}
            y2={yPoint}
            stroke={gridColor}
            strokeWidth={gridWidth}
          />
          <Line
            key={`y-axis tick${index}`}
            x1={marginXFromLeft}
            y1={yPoint}
            x2={marginXFromLeft - 5}
            y2={yPoint}
            stroke={axisColor}
            strokeWidth={axisWidth}
          />
          <SvgText
            key={`y-axis label${index}`}
            x={marginXFromLeft - 10}
            y={yPoint + axisLabelFontSize / 3}
            fill={axisColor}
            fontWeight="400"
            fontSize={axisLabelFontSize}
            textAnchor="end">
            {item}
          </SvgText>
        </G>
      );
    });
  };

  // Get Path
  const getDPath = () => {
    const maxValueAtYAxis = yAxisLabels[yAxisLabels?.length - 1];
    // const maxValue = max(yAxisLabels, (d, i) => parseFloat(yAxisLabels[i]));

    if (maxValueAtYAxis) {
      let dPath = '';
      lineChartData?.map((item, index) => {
        let xPoint = xAxisX1Point + gapBetweenXAxisAndTicks * (index + 1);
        const amount =
          type === 'expense' ? item?.expense_monthly : item?.income_monthly;
        let yPoint =
          (maxValueAtYAxis - +amount) *
            (gapBetweenYAxisAndTicks / gapBetweenYAxisValues) +
          paddingFromScreenBorder +
          gapBetweenYAxisAndTicks;
        if (isNaN(yPoint) || yPoint === Infinity) {
          yPoint = yAxisY2Point / 2;
        }
        if (index === 0) {
          dPath += `M${xPoint} ${yPoint}`;
        } else {
          dPath += `L${xPoint} ${yPoint}`;
        }
      });
      return dPath;
    }
  };

  const renderLineChartPath = () => {
    const dPath = getDPath();
    return (
      <Path d={dPath} strokeWidth={lineChartWidth} stroke={lineChartColor} />
    );
  };

  const renderLineChartCircles = () => {
    const maxValueAtYAxis = yAxisLabels[yAxisLabels.length - 1];
    // Check if no data
    const maxValue = max(yAxisLabels, (d, i) => parseFloat(yAxisLabels[i]));

    if (maxValueAtYAxis) {
      return lineChartData?.map((item, index) => {
        let xPoint = xAxisX1Point + gapBetweenXAxisAndTicks * (index + 1);
        const amount =
          type === 'expense' ? item?.expense_monthly : item?.income_monthly;
        let yPoint =
          (maxValueAtYAxis - +amount) *
            (gapBetweenYAxisAndTicks / gapBetweenYAxisValues) +
          paddingFromScreenBorder +
          gapBetweenYAxisAndTicks;

        return (
          <G key={`line chart circles${index}`}>
            <Circle
              cx={xPoint}
              cy={yPoint}
              r={maxValue !== 0 ? circleRadius : 0}
              fill={circleColor}
              onPress={() => updatePosition({x: xPoint, y: yPoint})}
            />
          </G>
        );
      });
    }
  };

  return (
    <View
      style={
        (StyleSheet.absoluteFill,
        [styles.svgWrapper, {height: containerHeight}])
      }>
      <Svg width="100%" height="100%" style={[styles.svgStyle]} fill="none">
        {renderXYAxis()}
        {renderXAxisLabelsAndTicks()}
        {renderYAxisLabelsAndTicks()}
        {renderLineChartPath()}
        {renderLineChartCircles()}
        {Tooltip()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  svgWrapper: {
    // marginTop: 20,
    // position: 'absolute',
    // top: 40,
    backgroundColor: '#e9e9e9',
  },
  svgStyle: {
    // backgroundColor: '#cdcdcd',
  },
});

export default LineChart;

type Props = {
  type: string;
  lineChartData: any[];
  containerHeight: number;
  circleColor: string;
  circleRadius: number;
  axisColor: string;
  axisWidth: number;
  gridColor: string;
  gridWidth: number;
  axisLabelFontSize: number;
  lineChartColor: string;
  lineChartWidth: number;
};

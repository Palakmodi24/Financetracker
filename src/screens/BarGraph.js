import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import * as d3 from 'd3-time-format';

const BarGraph = ({ data }) => {
  const formatMonth = d3.timeFormat('%B'); // Format for full month name
  const months = Array.from({ length: 12 }, (_, i) => formatMonth(new Date(2024, i)));

  // Prepare data for all 12 months, filling in 0 for missing months
  const formattedData = months.map((month, index) => {
    const dataPoint = data.find((d) => new Date(d.date).getMonth() === index);
    return { month, amount: dataPoint ? dataPoint.amount : 0 };
  });

  // Calculate tick values for y-axis
  const tickValues = Array.from({ length: 11 }, (_, i) => (i + 1) * 1000);

  return (
    <View style={styles.container}>
      <VictoryChart
        width={400}
        theme={VictoryTheme.material}
        domainPadding={{ x: 20 }}
      >
        <VictoryAxis
          tickValues={months}
          style={{
            tickLabels: { angle: -45, fontSize: 8 },
            grid: { stroke: '#ccc', strokeWidth: 0.5 }
          }}
        />
        <VictoryAxis dependentAxis tickValues={tickValues} />
        <VictoryBar
          data={formattedData}
          x="month"
          y="amount"
          style={{ data: { fill: '#FA5007' } }}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 55,
  },
});

export default BarGraph;



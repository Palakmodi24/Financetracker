import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import * as d3 from 'd3-time-format';

const BarGraph = ({ data }) => {
  const formatMonth = d3.timeFormat('%B'); // Format for full month name
  

  return (
    <View style={styles.container}>
      <VictoryChart width={400} theme={VictoryTheme.material}>
        <VictoryAxis
          tickFormat={(x) => formatMonth(new Date(x))}
          style={{
            tickLabels: { angle: -45, fontSize: 8 },
          }}
        />
        <VictoryAxis dependentAxis />
        <VictoryBar
          data={data.filter((d) => !isNaN(d.amount))}
          x="date"
          y="amount"
          style={{ data: { fill: '#c43a31' } }}
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
  },
});

export default BarGraph;

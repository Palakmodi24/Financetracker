import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

const data = [
    { month: 'Jan', income: 20000 },
    { month: 'Feb', income: 25000 },
    { month: 'Mar', income: 30000 },
    
  ];

const victorybar = () => {
    return (
        <View style={styles.container}>
          <VictoryChart width={350} theme={VictoryTheme.material}>
            <VictoryAxis dependentAxis tickFormat={(t) => `$${t}`} />
            <VictoryAxis tickValues={data.map((d) => d.month)} />
            <VictoryBar
              data={data}
              x="month"
              y="income"
              barRatio={0.4}
              style={{
                data: { fill: 'green' },
              }}
            />
          </VictoryChart>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    });
    

export default victorybar
import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export const Chart = ({ data }) => {
    const {t} = useTranslation('chart')

    const labels = data.map(([hour]) => hour);
    const values = data.map(([, count]) => count);

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        }
    };

    return (
        <View>
            <LineChart
                data={{
                    labels,
                    datasets: [
                        {
                            data: values,
                        },
                    ],
                }}
                width={300}
                height={200}
                chartConfig={chartConfig}
            />
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white', margin: 10 }}>{t('chartTitle')}</Text>
        </View>
    );
};

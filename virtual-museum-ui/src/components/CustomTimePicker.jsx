import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const CustomTimePicker = ({ value, onChange }) => {
    const generateHourOptions = () => {
        const hourOptions = [];

        for (let i = 0; i <= 23; i++) {
            hourOptions.push({ label: i.toString(), value: i });
        }

        return hourOptions;
    };

    const generateMinuteOptions = () => {
        const minuteOptions = [];

        for (let i = 0; i <= 59; i++) {
            minuteOptions.push({ label: i.toString(), value: i });
        }

        return minuteOptions;
    };

    return (
        <View>
            <View>
                <Text>Sat:</Text>
                <RNPickerSelect
                    onValueChange={onChange}
                    items={generateHourOptions()}
                    placeholder={{ label: 'Izaberite sat', value: null }}
                    value={value}
                />
            </View>
            <View>
                <Text>Minut:</Text>
                <RNPickerSelect
                    onValueChange={onChange}
                    items={generateMinuteOptions()}
                    placeholder={{ label: 'Izaberite minut', value: null }}
                    value={value}
                />
            </View>
            <Text>Izabrano vreme: {value}</Text>
        </View>
    );
};

export default CustomTimePicker;

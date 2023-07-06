import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const CustomDatePicker = ({ value, onChange }) => {
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const yearOptions = [];

        for (let i = currentYear; i <= currentYear + 3; i++) {
            yearOptions.push({ label: i.toString(), value: i });
        }

        return yearOptions;
    };

    const generateMonthOptions = () => {
        const monthOptions = [];

        for (let i = 1; i <= 12; i++) {
            monthOptions.push({ label: i.toString(), value: i });
        }

        return monthOptions;
    };

    const generateDayOptions = () => {
        const dayOptions = [];

        for (let i = 1; i <= 31; i++) {
            dayOptions.push({ label: i.toString(), value: i });
        }

        return dayOptions;
    };

    return (
        <View>
            <View>
                <Text>Godina:</Text>
                <RNPickerSelect
                    onValueChange={onChange}
                    items={generateYearOptions()}
                    placeholder={{ label: 'Izaberite godinu', value: null }}
                    value={value}
                />
            </View>
            <View>
                <Text>Mesec:</Text>
                <RNPickerSelect
                    onValueChange={onChange}
                    items={generateMonthOptions()}
                    placeholder={{ label: 'Izaberite mesec', value: null }}
                    value={value}
                />
            </View>
            <View>
                <Text>Dan:</Text>
                <RNPickerSelect
                    onValueChange={onChange}
                    items={generateDayOptions()}
                    placeholder={{ label: 'Izaberite dan', value: null }}
                    value={value}
                />
            </View>
            <Text>Izabrani datum: {value}</Text>
        </View>
    );
};

export default CustomDatePicker;
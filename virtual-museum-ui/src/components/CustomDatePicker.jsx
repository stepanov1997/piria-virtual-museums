import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {CustomPicker} from "./CustomPicker";

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

    const valueChange = (index) => {
        return value => {
            onChange(prevValue => {
                prevValue[index] = value
                console.log(prevValue)
                return prevValue
            })
        }
    }

    return (
        <View>
            <View>
                <Text>Year:</Text>
                <CustomPicker
                    onValueChange={valueChange(0)}
                    items={generateYearOptions()}
                    labelMapper={item => item.label}
                    valueMapper={item => item.value}
                    placeholder={"Choose year:"}
                    value={value[0]}
                />
            </View>
            <View>
                <Text>Month:</Text>
                <CustomPicker
                    onValueChange={valueChange(1)}
                    items={generateMonthOptions()}
                    labelMapper={item => item.label}
                    valueMapper={item => item.value}
                    placeholder={"Choose month:"}
                    value={value[1]}
                />
            </View>
            <View>
                <Text>Day:</Text>
                <CustomPicker
                    onValueChange={valueChange(2)}
                    items={generateDayOptions()}
                    labelMapper={item => item.label}
                    valueMapper={item => item.value}
                    placeholder={"Choose day:"}
                    value={value[2]}
                />
            </View>
            <Text>Izabrani datum: {value}</Text>
        </View>
    );
};

export default CustomDatePicker;
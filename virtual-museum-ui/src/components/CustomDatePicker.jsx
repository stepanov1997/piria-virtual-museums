import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {CustomPicker} from "./CustomPicker";
import {useTranslation} from "react-i18next";

const CustomDatePicker = ({ value, onChange }) => {
    const {t} = useTranslation('customDatePicker')

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
                    placeholder={t('yearPickerPlaceholder')}
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
                    placeholder={t('monthPickerPlaceholder')}
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
                    placeholder={t('dayPickerPlaceholder')}
                    value={value[2]}
                />
            </View>
        </View>
    );
};

export default CustomDatePicker;